import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery } from '@/store/tasksSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const SearchBar = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.tasks.searchQuery);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        className="h-10 pl-9 pr-9 bg-card border-border"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setSearchQuery(''))}
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
