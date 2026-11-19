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

/**
 * Searchable select. Keyboard: arrows move, Enter picks (never submits the surrounding form),
 * Escape closes, Tab away closes. Follows the WAI-ARIA combobox + listbox pattern.
 * `required` only shows the star; the parent form validates the value.
 */
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
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const normalizedOptions: ComboboxOption[] = useMemo(
    () => options.map((opt) => (typeof opt === "string" ? { value: opt, label: opt } : opt)),
    [options],
  );

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter((opt) => `${opt.label} ${opt.group || ""}`.toLowerCase().includes(q));
  }, [normalizedOptions, search]);

  // Groups keep the flat order of filteredOptions, so the active index maps to one option either way.
  const grouped = useMemo(() => {
    if (!filteredOptions.some((o) => Boolean(o.group))) return null;
    const map = new Map<string, { opt: ComboboxOption; index: number }[]>();
    filteredOptions.forEach((opt, index) => {
      const g = opt.group || "Other";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push({ opt, index });
    });
    return Array.from(map.entries());
  }, [filteredOptions]);

  const customValue = allowCustom ? search.trim() : "";
  const showCustom = Boolean(customValue) && filteredOptions.length === 0;

  useEffect(() => setActive(0), [search, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => searchInputRef.current?.focus(), 30);
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) close(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the highlighted option in view while using the arrow keys.
  useEffect(() => {
    if (open) document.getElementById(optionId(active))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, open]);

  const selectedLabel = useMemo(() => {
    const found = normalizedOptions.find((o) => o.value.toLowerCase() === value.toLowerCase());
    return found ? found.label : value;
  }, [normalizedOptions, value]);

  function close(returnFocus: boolean) {
    setOpen(false);
    setSearch("");
    if (returnFocus) triggerRef.current?.focus();
  }

  function handleSelect(val: string) {
    onChange(val);
    close(true);
  }

  function handleClear() {
    onChange("");
    close(true);
  }

  const showClear = Boolean(value) && !disabled;

  function onSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const count = filteredOptions.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (count) setActive((a) => (a + 1) % count);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (count) setActive((a) => (a - 1 + count) % count);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (count) setActive(count - 1);
    } else if (e.key === "Enter") {
      // Enter inside the dropdown picks a value; it must never submit the whole form.
      e.preventDefault();
      if (count) handleSelect(filteredOptions[Math.min(active, count - 1)].value);
      else if (customValue) handleSelect(customValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    }
  }

  function renderOption(opt: ComboboxOption, index: number) {
    return (
      <OptionItem
        key={opt.value}
        id={optionId(index)}
        opt={opt}
        isActive={index === active}
        isSelected={value.toLowerCase() === opt.value.toLowerCase()}
        onHover={() => setActive(index)}
        onSelect={() => handleSelect(opt.value)}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-2 text-sm font-semibold text-gray-700"
      onBlur={(e) => {
        // Tabbing out of the whole widget closes it.
        if (open && !containerRef.current?.contains(e.relatedTarget as Node | null)) close(false);
      }}
    >
      <label id={labelId} htmlFor={triggerId}>
        {label}{" "}
        {required && (
          <span className="text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="relative">
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          onClick={() => (open ? close(false) : setOpen(true))}
          onKeyDown={(e) => {
            if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
              e.preventDefault();
              setOpen(true);
            }
          }}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listId : undefined}
          aria-required={required || undefined}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white py-3.5 pl-4 ${showClear ? "pr-[4.5rem]" : "pr-4"} text-left text-base font-normal transition-all outline-none ${
            disabled
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : open
                ? "border-brand ring-4 ring-brand/10 shadow-sm"
                : "border-gray-300 text-[#111111] hover:border-gray-400 focus:border-brand focus:ring-2 focus:ring-brand-tint"
          }`}
        >
          <span className={`block truncate ${!value ? "text-gray-400" : "font-medium text-ink"}`}>{value ? selectedLabel : placeholder}</span>
          <span className={`flex items-center text-gray-400 ${showClear ? "absolute right-4 top-1/2 -translate-y-1/2" : ""}`}>
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

        {/* Sits on top of the field, beside the arrow. A sibling, not a child: a button can't hold another button. */}
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={`Clear ${label}`}
            title="Clear"
            className="absolute right-10 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 flex max-h-72 flex-col overflow-hidden rounded-[22px] border border-gray-200 bg-white p-2 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
          <div className="relative mb-2 px-1">
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
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
              role="combobox"
              aria-label={`Search ${label}`}
              aria-expanded={true}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={filteredOptions.length ? optionId(Math.min(active, filteredOptions.length - 1)) : undefined}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm font-normal text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand-tint"
            />
          </div>

          <div ref={listRef} id={listId} role="listbox" aria-labelledby={labelId} className="flex-1 overflow-y-auto px-1">
            {grouped ? (
              <div className="flex flex-col gap-3 pb-1">
                {grouped.map(([groupName, items]) => (
                  <div key={groupName} role="group" aria-label={groupName} className="flex flex-col gap-1">
                    <span aria-hidden="true" className="px-3 pt-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400">
                      {groupName}
                    </span>
                    {items.map(({ opt, index }) => renderOption(opt, index))}
                  </div>
                ))}
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="flex flex-col gap-1 pb-1">{filteredOptions.map((opt, i) => renderOption(opt, i))}</div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="text-xs text-gray-500">{emptyText}</p>
                {showCustom && (
                  <button
                    type="button"
                    onClick={() => handleSelect(customValue)}
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-ink"
                  >
                    <span>Use &ldquo;{customValue}&rdquo;</span>
                    <span aria-hidden="true">→</span>
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
  id,
  opt,
  isActive,
  isSelected,
  onHover,
  onSelect,
}: {
  id: string;
  opt: ComboboxOption;
  isActive: boolean;
  isSelected: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={isSelected}
      onMouseMove={onHover}
      // mousedown would blur the search box first and close the list; prevent that.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
        isSelected ? "bg-brand-tint/80 font-semibold text-brand-dark" : isActive ? "bg-gray-100 text-ink" : "text-gray-700"
      } ${isActive ? "ring-2 ring-brand/40" : ""}`}
    >
      <span className="flex items-center gap-2 truncate">
        {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
        <span>{opt.label}</span>
      </span>
      {isSelected && (
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="size-4 flex-none text-brand-dark">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
