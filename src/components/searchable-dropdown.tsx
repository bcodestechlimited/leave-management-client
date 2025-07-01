import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { capitalizeWords, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DropdownOption {
  label: string;
  value: string;
}

interface SearchableDropdownProps {
  searchInputPlaceholder?: string;
  placeholder?: string;
  fetchOptions: (search: string) => Promise<DropdownOption[]>; // Fetch options dynamically
  onChange?: (option: DropdownOption) => void;
  error?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  placeholder = "Select an option",
  searchInputPlaceholder = "Search...",
  fetchOptions,
  onChange,
  error,
}) => {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    // Cleanup the timeout on input change
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch options whenever debounced search changes
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setLoading(true);
      try {
        const fetchedOptions = await fetchOptions(debouncedSearch);
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownOptions();
  }, [debouncedSearch, fetchOptions]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value ? capitalizeWords(value) : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput
              onValueChange={(newInput) => {
                setLoading(true);
                setSearch(newInput);
              }}
              placeholder={searchInputPlaceholder}
            />
            <CommandList>
              {loading && <p className="text-center py-3">Loading...</p>}

              {!loading && search && options.length < 1 ? (
                <CommandEmpty>No result found for '{search}'</CommandEmpty>
              ) : null}

              {!loading && options.length > 0 ? (
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? value : currentValue);
                        if (onChange) {
                          onChange({
                            value: option.value,
                            label: option.label,
                          });
                        }
                        setOpen(false);
                      }}
                    >
                      <span className="capitalize">{option.label}</span>
                      <Check
                        className={cn(
                          "ml-auto",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
