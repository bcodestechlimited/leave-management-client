import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";

export default function SearchInput({ placeholder }: { placeholder?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("search") || ""
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("search", searchInput);
        // newParams.set("page", "1"); // Reset to first page on new search
        return newParams;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <Input
      type="text"
      placeholder={placeholder || `Search by name or email`}
      value={searchInput}
      onChange={handleSearchChange}
      className="w-64"
    />
  );
}
