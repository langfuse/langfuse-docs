"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { CATEGORIES, TERMS } from "@/lib/glossary-data";

type CategoryKey = keyof typeof CATEGORIES;

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  OBSERVABILITY:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  EVALUATION:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  PROMPTS:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  SDK: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  PLATFORM:
    "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800",
  API: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

export interface GlossaryTerm {
  term: string;
  id: string;
  definition: string;
  link?: string;
  categories: CategoryKey[];
  relatedTerms?: string[];
  synonyms?: string[];
}

const GLOSSARY_TERMS = TERMS;

// Create a map for quick lookup of terms by id
const termMap = new Map(GLOSSARY_TERMS.map((t) => [t.id, t]));

// Get all unique first letters
const getAlphabet = (terms: GlossaryTerm[]) => {
  const letters = new Set(terms.map((t) => t.term[0].toUpperCase()));
  return Array.from(letters).sort();
};

// Category badge component
const CategoryBadge = ({
  category,
  onClick,
  isActive,
}: {
  category: CategoryKey;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const cat = CATEGORIES[category];
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-all",
        CATEGORY_COLORS[category],
        onClick && "cursor-pointer hover:opacity-80",
        isActive && "ring-2 ring-offset-1 ring-primary",
      )}
    >
      {cat.label}
    </button>
  );
};

// Related term link
const RelatedTermLink = ({ termId }: { termId: string }) => {
  const term = termMap.get(termId.toLowerCase().replace(/\s+/g, "-"));
  if (!term) {
    // Try to find by term name
    const foundTerm = GLOSSARY_TERMS.find(
      (t) => t.term.toLowerCase() === termId.toLowerCase(),
    );
    if (foundTerm) {
      return (
        <a
          href={`#${foundTerm.id}`}
          className="text-primary hover:underline text-sm"
        >
          {foundTerm.term}
        </a>
      );
    }
    return <span className="text-sm text-muted-foreground">{termId}</span>;
  }
  return (
    <a href={`#${term.id}`} className="text-primary hover:underline text-sm">
      {term.term}
    </a>
  );
};

// Single glossary entry component
const GlossaryEntry = ({ term }: { term: GlossaryTerm }) => {
  return (
    <div
      id={term.id}
      className="scroll-mt-20 py-4 border-b border-border last:border-b-0"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold m-0">
            {term.link ? (
              <Link href={term.link} className="hover:text-primary">
                {term.term}
              </Link>
            ) : (
              term.term
            )}
          </h3>
          {term.synonyms && term.synonyms.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({term.synonyms.join(", ")})
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {term.categories.map((cat) => (
            <React.Fragment key={cat}>
              <CategoryBadge category={cat} />
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-muted-foreground m-0 mt-1">
          {term.definition}
        </p>
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Related:
            </span>
            {term.relatedTerms.map((rt, i) => (
              <React.Fragment key={rt}>
                <RelatedTermLink termId={rt} />
                {i < term.relatedTerms!.length - 1 && (
                  <span className="text-muted-foreground">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Glossary component
export const Glossary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);

  const toggleCategory = (category: CategoryKey) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setSearchQuery("");
  };

  // Filter terms based on search and categories
  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((term) => {
      const matchesSearch =
        searchQuery === "" ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.synonyms?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategories =
        activeCategories.length === 0 ||
        term.categories.some((c) => activeCategories.includes(c));

      return matchesSearch && matchesCategories;
    });
  }, [searchQuery, activeCategories]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const alphabet = getAlphabet(GLOSSARY_TERMS);
  const activeLetters = new Set(Object.keys(groupedTerms));

  const hasActiveFilters = activeCategories.length > 0 || searchQuery !== "";

  return (
    <div className="mt-6">
      {/* Filters section */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-2 -mt-2 border-b border-border mb-4">
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground mr-1">Filter:</span>
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
            <React.Fragment key={cat}>
              <CategoryBadge
                category={cat}
                onClick={() => toggleCategory(cat)}
                isActive={activeCategories.includes(cat)}
              />
            </React.Fragment>
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Alphabetical navigation */}
        <div className="flex flex-wrap gap-1 mt-4 text-sm">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={activeLetters.has(letter) ? `#letter-${letter}` : undefined}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded transition-colors",
                activeLetters.has(letter)
                  ? "text-primary hover:bg-primary/10 font-medium"
                  : "text-muted-foreground/40 cursor-default",
              )}
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredTerms.length} of {GLOSSARY_TERMS.length} terms
      </p>

      {/* Glossary entries grouped by letter */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No terms found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        (Object.entries(groupedTerms) as [string, GlossaryTerm[]][])
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, terms]) => (
            <div key={letter} id={`letter-${letter}`} className="mb-6">
              <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-1 mb-2 scroll-mt-48">
                {letter}
              </h2>
              {terms
                .sort((a, b) => a.term.localeCompare(b.term))
                .map((term) => (
                  <React.Fragment key={term.id}>
                    <GlossaryEntry term={term} />
                  </React.Fragment>
                ))}
            </div>
          ))
      )}
    </div>
  );
};

export default Glossary;
