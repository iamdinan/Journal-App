import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUpDown } from 'lucide-react';

export type SortOrder = 'newest' | 'oldest';

interface SortFilterProps {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}

const SortFilter = ({ value, onChange }: SortFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] gap-2">
        <ArrowUpDown className="h-4 w-4" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortFilter;
