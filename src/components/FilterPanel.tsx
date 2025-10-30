import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ConceptTooltip } from '@/components/ConceptTooltip';
import { FunnelSimple, X } from '@phosphor-icons/react';
import { GitBranch } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  branches: GitBranch[];
  authors: string[];
  onFilterChange: (filters: {
    branches: string[];
    authors: string[];
    searchQuery: string;
  }) => void;
}

export const FilterPanel = ({ branches, authors, onFilterChange }: FilterPanelProps) => {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBranchToggle = (branch: string) => {
    const updated = selectedBranches.includes(branch)
      ? selectedBranches.filter(b => b !== branch)
      : [...selectedBranches, branch];
    setSelectedBranches(updated);
    onFilterChange({ branches: updated, authors: selectedAuthors, searchQuery });
  };

  const handleAuthorToggle = (author: string) => {
    const updated = selectedAuthors.includes(author)
      ? selectedAuthors.filter(a => a !== author)
      : [...selectedAuthors, author];
    setSelectedAuthors(updated);
    onFilterChange({ branches: selectedBranches, authors: updated, searchQuery });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onFilterChange({ branches: selectedBranches, authors: selectedAuthors, searchQuery: query });
  };

  const handleClearAll = () => {
    setSelectedBranches([]);
    setSelectedAuthors([]);
    setSearchQuery('');
    onFilterChange({ branches: [], authors: [], searchQuery: '' });
  };

  const hasActiveFilters = selectedBranches.length > 0 || selectedAuthors.length > 0 || searchQuery;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FunnelSimple size={20} />
            Filters
            <ConceptTooltip
              title="Filter Commits"
              explanation="Focus on specific commits by filtering by branch, author, or searching commit messages and hashes."
              emoji="🔍"
            />
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {(selectedBranches.length + selectedAuthors.length + (searchQuery ? 1 : 0))}
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search" className="flex items-center gap-2">
                  Search
                  <ConceptTooltip
                    title="Search Commits"
                    explanation="Search through commit messages, hashes, and other metadata to find specific commits."
                    emoji="🔎"
                  />
                </Label>
                <Input
                  id="search"
                  placeholder="Search commits, hashes, messages..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  Branches
                  <ConceptTooltip
                    title="Filter by Branch"
                    explanation="Show only commits that belong to selected branches. Click a branch badge to toggle filtering."
                    emoji="🌿"
                  />
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {branches.map((branch, index) => (
                    <motion.div
                      key={branch.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge
                        variant={selectedBranches.includes(branch.name) ? 'default' : 'outline'}
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => handleBranchToggle(branch.name)}
                        style={{
                          backgroundColor: selectedBranches.includes(branch.name) ? branch.color : undefined
                        }}
                      >
                        {branch.name}
                        {selectedBranches.includes(branch.name) && (
                          <X size={14} className="ml-1" />
                        )}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  Authors
                  <ConceptTooltip
                    title="Filter by Author"
                    explanation="Show only commits created by selected authors. Each author is represented by their cute animal avatar!"
                    emoji="👥"
                  />
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {authors.map((author, index) => (
                    <motion.div
                      key={author}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge
                        variant={selectedAuthors.includes(author) ? 'default' : 'outline'}
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => handleAuthorToggle(author)}
                      >
                        {author}
                        {selectedAuthors.includes(author) && (
                          <X size={14} className="ml-1" />
                        )}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
