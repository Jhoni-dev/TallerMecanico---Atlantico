// src/components/clients/SearchBar.tsx

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ITEMS_PER_PAGE_OPTIONS } from "@/app/frontend/constants/client.constants";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export function SearchBar({
  searchTerm,
  onSearchChange,
  itemsPerPage,
  onItemsPerPageChange,
}: SearchBarProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente, email, placa..."
          className="pl-10 text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label
          htmlFor="items-per-page"
          className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
        >
          Mostrar:
        </Label>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
        >
          <SelectTrigger id="items-per-page" className="w-[80px] sm:w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
