// components/ui/custom-dropdown.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CustomDropdownProps {
  label: string;
  placeholder: string;
  value: string | null;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  error?: string;
}

export const CustomDropdown = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
}: CustomDropdownProps) => {
  return (
    <div className="mb-4">
      <Label className="block text-sm font-medium mb-1">{label}</Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};
