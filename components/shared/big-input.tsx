import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { RefObject } from "react";

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSearch?: boolean;
  ref?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
}

export function SearchInput({
  placeholder = "Search...",
  query,
  setQuery,
  ref,
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder={placeholder}
        ref={ref ?? null}
        autoFocus={autoFocus}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
