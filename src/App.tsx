import { useState, useMemo, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { CommitGraph } from '@/components/CommitGraph';
import { CommitDetailPanel } from '@/components/CommitDetailPanel';
import { ScenarioExplorer } from '@/components/ScenarioExplorer';
import { FilterPanel } from '@/components/FilterPanel';
import { TimelinePlayer } from '@/components/TimelinePlayer';
import { createSampleRepository } from '@/lib/mockData';
import { filterCommits } from '@/lib/graphLayout';
import { GitRepository, Scenario } from '@/lib/types';
import { Moon, Sun, GitBranch } from '@phosphor-icons/react';
import { toast } from 'sonner';

function App() {
  const [repository] = useState<GitRepository>(createSampleRepository());
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode, deleteIsDarkMode] = useKV<boolean>('dark-mode', false);
  const [activeTab, setActiveTab, deleteActiveTab] = useKV<'explore' | 'scenarios' | 'timeline'>('active-tab', 'explore');
  const [filters, setFilters] = useState({
    branches: [] as string[],
    authors: [] as string[],
    searchQuery: ''
  });
  const [timelineVisibleCommits, setTimelineVisibleCommits] = useState<string[]>(
    repository.commits.map(c => c.id)
  );

  const selectedCommit = repository.commits.find(c => c.id === selectedCommitId) || null;

  const filteredRepository = useMemo(() => {
    const baseFiltered = filterCommits(repository, filters);
    
    if (activeTab === 'timeline') {
      return {
        ...baseFiltered,
        commits: baseFiltered.commits.filter(c => timelineVisibleCommits.includes(c.id))
      };
    }
    
    return baseFiltered;
  }, [repository, filters, activeTab, timelineVisibleCommits]);

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(repository.commits.map(c => c.author.name)));
  }, [repository]);

  const handleScenarioSelect = (scenario: Scenario) => {
    toast.success(`Starting scenario: ${scenario.title}`);
    setActiveTab('explore');
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitBranch size={32} className="text-primary" weight="bold" />
              <div>
                <h1 className="text-2xl font-bold">Git Garden</h1>
                <p className="text-sm text-muted-foreground">Learn Git Visually</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sun size={16} />
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                  id="theme-toggle"
                />
                <Moon size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'explore' | 'scenarios' | 'timeline')}>
          <TabsList className="mb-6">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-4">
            <FilterPanel
              branches={repository.branches}
              authors={uniqueAuthors}
              onFilterChange={setFilters}
            />
            
            <div className="h-[600px]">
              <CommitGraph
                repository={filteredRepository}
                selectedCommit={selectedCommitId || undefined}
                onCommitClick={setSelectedCommitId}
                animateTransitions={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioExplorer onScenarioSelect={handleScenarioSelect} />
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <TimelinePlayer
              commits={repository.commits}
              onTimelineUpdate={setTimelineVisibleCommits}
            />
            
            <div className="h-[600px]">
              <CommitGraph
                repository={filteredRepository}
                selectedCommit={selectedCommitId || undefined}
                onCommitClick={setSelectedCommitId}
                animateTransitions={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <CommitDetailPanel
        commit={selectedCommit}
        isOpen={selectedCommitId !== null}
        onClose={() => setSelectedCommitId(null)}
      />
    </div>
  );
}

export default App;