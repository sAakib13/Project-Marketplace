"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  categories: string[];
  selectedCategory: string;
  filterLabel?: string;
}

export default function SearchAndFilter({
  onSearch,
  onCategoryFilter,
  categories,
  selectedCategory,
  filterLabel = "Categories",
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategorySelect = (category: string) => {
    onCategoryFilter(category);
    setIsFilterOpen(false);
  };

  const getDisplayValue = () => {
    if (selectedCategory === "all") {
      return `All ${filterLabel}`;
    }
    return selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      {/* Search Bar */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects, organizations, or features..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex min-w-[160px] items-center space-x-2 rounded-xl border border-gray-300 bg-white px-4 py-3 transition-colors duration-200 hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">{getDisplayValue()}</span>
          {selectedCategory !== "all" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCategoryFilter("all");
              }}
              className="rounded-full p-1 transition-colors duration-200 hover:bg-gray-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </button>

        {/* Filter Dropdown */}
        {isFilterOpen && (
          <div className="min-w-48 absolute left-0 right-0 top-full z-10 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="p-2">
              <button
                onClick={() => handleCategorySelect("all")}
                className={`w-full rounded-lg px-3 py-2 text-left transition-colors duration-200 ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All {filterLabel}
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full rounded-lg px-3 py-2 text-left capitalize transition-colors duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
