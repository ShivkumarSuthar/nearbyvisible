"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type ComboboxOption = {
  value: string;
  label: string;
  group?: string;
  icon?: string;
};

type ComboboxProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: (ComboboxOption | string)[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  allowCustom?: boolean;
  emptyText?: string;
};

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Type to search...",
  disabled = false,
  required = false,
  allowCustom = true,
  emptyText = "No matching options found.",
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  // Normalize options to ComboboxOption objects
  const normalizedOptions: ComboboxOption[] = useMemo(() => {
    return options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt));
  }, [options]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter((opt) =>
      `${opt.label} ${opt.group || ""}`.toLowerCase().includes(q)
    );
  }, [normalizedOptions, search]);

  // Group filtered options if any option has a group
  const grouped = useMemo(() => {
    const hasGroups = filteredOptions.some((o) => Boolean(o.group));
    if (!hasGroups) return null;

    const map = new Map<string, ComboboxOption[]>();
    for (const opt of filteredOptions) {
      const g = opt.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(opt);
    }
    return Array.from(map.entries());
  }, [filteredOptions]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-focus search input when popover opens
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const selectedLabel = useMemo(() => {
    const found = normalizedOptions.find((o) => o.value.toLowerCase() === value.toLowerCase());
    return found ? found.label : value;
  }, [normalizedOptions, value]);

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setSearch("");
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2 text-sm font-semibold text-gray-700">
      <label htmlFor={inputId} className="flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-normal text-muted-dark hover:text-ink hover:underline"
          >
            Clear
          </button>
        )}
      </label>

      {/* Hidden input to ensure HTML5 validation if required */}
      <input
        type="text"
        required={required}
        value={value}
        readOnly
        tabIndex={-1}
        className="pointer-events-none absolute bottom-0 left-0 size-0 opacity-0"
      />

      {/* Trigger Button */}
      <button
        id={inputId}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left text-base font-normal transition-all outline-none ${
          disabled
            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
            : open
            ? "border-brand ring-4 ring-brand/10 shadow-sm"
            : "border-gray-300 text-[#111111] hover:border-gray-400 focus:border-brand focus:ring-2 focus:ring-brand-tint"
        }`}
      >
        <span className={`block truncate ${!value ? "text-gray-400" : "font-medium text-ink"}`}>
          {value ? selectedLabel : placeholder}
        </span>

        <span className="flex items-center gap-1.5 text-gray-400">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className={`size-5 transition-transform duration-200 ${open ? "rotate-180 text-brand-dark" : ""}`}
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex max-h-72 flex-col overflow-hidden rounded-[22px] border border-gray-200 bg-white p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)] animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Search Box */}
          <div className="relative mb-2 px-1">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm font-normal text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand-tint"
            />
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto px-1">
            {grouped ? (
              <div className="flex flex-col gap-3 pb-1">
                {grouped.map(([groupName, items]) => (
                  <div key={groupName} className="flex flex-col gap-1">
                    <span className="px-3 pt-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {groupName}
                    </span>
                    {items.map((opt) => (
                      <OptionItem
                        key={opt.value}
                        opt={opt}
                        isSelected={value.toLowerCase() === opt.value.toLowerCase()}
                        onSelect={() => handleSelect(opt.value)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="flex flex-col gap-1 pb-1">
                {filteredOptions.map((opt) => (
                  <OptionItem
                    key={opt.value}
                    opt={opt}
                    isSelected={value.toLowerCase() === opt.value.toLowerCase()}
                    onSelect={() => handleSelect(opt.value)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs text-gray-500">{emptyText}</p>
                {allowCustom && search.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSelect(search.trim())}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-semibold text-brand-dark hover:bg-brand hover:text-ink transition-colors"
                  >
                    <span>Use &ldquo;{search.trim()}&rdquo;</span>
                    <span>→</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OptionItem({
  opt,
  isSelected,
  onSelect,
}: {
  opt: ComboboxOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
        isSelected
          ? "bg-brand-tint/80 font-semibold text-brand-dark"
          : "text-gray-700 hover:bg-gray-100 hover:text-ink"
      }`}
    >
      <span className="flex items-center gap-2 truncate">
        {opt.icon && <span>{opt.icon}</span>}
        <span>{opt.label}</span>
      </span>
      {isSelected && (
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4 flex-none text-brand-dark">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );
}
