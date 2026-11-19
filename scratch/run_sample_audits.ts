import fs from "fs";
import path from "path";

// Load .env.local
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn("Could not load .env.local", e);
}

import { searchPlaces } from "../lib/audit/google";
import { runAudit } from "../lib/audit/run";

async function runSample(name: string, city: string, category: string, competitor?: string) {
  console.log(`\n======================================================`);
  console.log(`🔍 AUDITING: ${name} (${city}) - Category: ${category}`);
  console.log(`======================================================`);

  // Step 1: Search places
  console.log(`Step 1: Searching matching Google Places for "${name} ${city}"...`);
  const places = await searchPlaces(`${name} ${city}`, 3);
  console.log(`Found ${places.length} matching candidates:`);
  places.forEach((p, i) => {
    console.log(`  [${i + 1}] ${p.name}`);
    console.log(`      Address: ${p.address}`);
    console.log(`      Rating: ${p.rating ?? "N/A"}★ (${p.reviews ?? 0} reviews)`);
    console.log(`      Phone: ${p.phone ?? "N/A"}`);
    console.log(`      Category: ${p.typeLabel ?? "N/A"}`);
  });

  if (places.length === 0) {
    console.log("No places found.");
    return;
  }

  // Pick the top matched place
  const chosen = places[0];
  console.log(`\nStep 2: Selected "${chosen.name}" for the full audit...`);

  // Step 2: Run audit
  const report = await runAudit({
    placeId: chosen.id,
    name: chosen.name,
    city,
    category,
    website: chosen.website,
    competitor,
  });

  console.log(`\n📊 AUDIT RESULTS SUMMARY:`);
  console.log(`  - Overall Visibility Score: ${report.score} / 100`);
  console.log(`  - Confidence: ${report.confidence.toUpperCase()}`);
  console.log(`  - Coverage: ${Math.round(report.coverage * 100)}% measured`);

  console.log(`\n📈 SCORES BY PILLAR:`);
  report.categories.forEach((c) => {
    console.log(`  - ${c.name.padEnd(35)}: ${String(c.score ?? "—").padStart(3)} / 100 (Weight: ${c.weight})`);
  });

  if (report.competitors?.benchmark) {
    const bm = report.competitors.benchmark;
    console.log(`\n⚔️ HEAD-TO-HEAD COMPETITOR COMPARISON:`);
    console.log(`  - Your Google Maps Rank : #${report.competitors.rank ?? "20+"}`);
    console.log(`  - Rival: ${bm.competitor.name} (${bm.competitor.rank ? `position ${bm.competitor.rank}` : "not in local top 20"}${bm.chosen ? ", named by user" : ""})`);
    console.log(`  - Rating Comparison    : You: ${report.business.rating ?? "N/A"}★ vs Rival: ${bm.competitor.rating ?? "N/A"}★`);
    console.log(`  - Review Volume Gap    : You: ${report.business.reviews ?? 0} vs Rival: ${bm.competitor.reviews ?? 0} (Diff: ${bm.reviewsDiff > 0 ? "+" + bm.reviewsDiff + " needed" : "Ahead"})`);
    console.log(`  - Key Gaps Identified:`);
    bm.keyGaps.forEach((g) => console.log(`      • ${g}`));
  }

  const failedTests = report.tests.filter((t) => t.status === "FAIL");
  const warnTests = report.tests.filter((t) => t.status === "WARNING");
  const passTests = report.tests.filter((t) => t.status === "PASS");

  console.log(`\n🔍 TEST BREAKDOWN: ${passTests.length} Passed, ${warnTests.length} Warnings, ${failedTests.length} Failed`);
  if (failedTests.length > 0) {
    console.log(`\n🚨 TOP PRIORITY FIXES (FAILED TESTS):`);
    failedTests.slice(0, 4).forEach((t, i) => {
      console.log(`  ${i + 1}. [${t.name}]`);
      console.log(`     Issue: ${t.actual}`);
      console.log(`     Fix  : ${t.fix}`);
    });
  }
}

async function main() {
  // Test 1: Ramesh Dental Care in Jaipur
  await runSample("Ramesh Dental Care", "Jaipur", "Dental Clinic", "Apex Dental");

  // Test 2: Royal Spice Restaurant in Delhi
  await runSample("Royal Spice Restaurant", "Delhi", "Restaurant", "Karim's");
}

main().catch(console.error);
