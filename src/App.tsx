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
import { CommandInput } from '@/components/CommandInput';
import { ExplanationPanel } from '@/components/ExplanationPanel';
import { ConceptTooltip } from '@/components/ConceptTooltip';
import { createSampleRepository } from '@/lib/mockData';
import { filterCommits } from '@/lib/graphLayout';
import { GitRepository, Scenario } from '@/lib/types';
import { Moon, Sun, GitBranch, Info } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function App() {
  const [repository] = useState<GitRepository>(createSampleRepository());
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useKV<boolean>('dark-mode', false);
  const [activeTab, setActiveTab] = useKV<'explore' | 'scenarios' | 'timeline' | 'terminal'>('active-tab', 'explore');
  const [showExplanations, setShowExplanations] = useKV<boolean>('show-explanations', true);
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
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <GitBranch size={32} className="text-primary" weight="bold" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">Git Garden</h1>
                  <ConceptTooltip
                    title="Welcome to Git Garden!"
                    explanation="An interactive playground for learning Git concepts through visual exploration. Click commits, try commands, and explore scenarios to master version control."
                    emoji="🌿"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Learn Git Visually</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="explanations-toggle" className="text-sm cursor-pointer">
                  Explanations
                </Label>
                <Switch
                  checked={showExplanations}
                  onCheckedChange={setShowExplanations}
                  id="explanations-toggle"
                />
              </div>
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
        <Tabs value={activeTab} onValueChange={(val) => {
          if (val === 'explore' || val === 'scenarios' || val === 'timeline' || val === 'terminal') {
            setActiveTab(val);
          }
        }}>
          <TabsList className="mb-6">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-4">
            <FilterPanel
              branches={repository.branches}
              authors={uniqueAuthors}
              onFilterChange={setFilters}
            />
            
            <div className={`grid gap-4 ${showExplanations ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <div className={showExplanations ? 'lg:col-span-2' : 'col-span-1'}>
                <div className="h-[600px]">
                  <CommitGraph
                    repository={filteredRepository}
                    selectedCommit={selectedCommitId || undefined}
                    onCommitClick={setSelectedCommitId}
                    animateTransitions={true}
                  />
                </div>
              </div>
              
              {showExplanations && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-[600px]"
                >
                  <ExplanationPanel />
                </motion.div>
              )}
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
            
            <div className={`grid gap-4 ${showExplanations ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <div className={showExplanations ? 'lg:col-span-2' : 'col-span-1'}>
                <div className="h-[600px]">
                  <CommitGraph
                    repository={filteredRepository}
                    selectedCommit={selectedCommitId || undefined}
                    onCommitClick={setSelectedCommitId}
                    animateTransitions={true}
                  />
                </div>
              </div>
              
              {showExplanations && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-[600px]"
                >
                  <ExplanationPanel />
                </motion.div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="terminal" className="space-y-4">
            <div className={`grid gap-4 ${showExplanations ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              <div className={showExplanations ? 'lg:col-span-2' : 'col-span-1'}>
                <div className="h-[600px]">
                  <CommandInput onCommandExecute={(cmd) => {
                    console.log('Command executed:', cmd);
                  }} />
                </div>
              </div>
              
              {showExplanations && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-[600px]"
                >
                  <ExplanationPanel />
                </motion.div>
              )}
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