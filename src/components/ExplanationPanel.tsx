import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Book, Question, Sparkle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { gitConcepts } from '@/lib/mockData';
import { useState } from 'react';

interface ExplanationPanelProps {
  selectedConcept?: keyof typeof gitConcepts;
}

const quickTips = [
  { id: 1, tip: 'Commits are snapshots, not differences. Git stores the complete state of your files.', icon: '📸' },
  { id: 2, tip: 'Branches are just pointers to commits. Creating branches is cheap and fast!', icon: '🌿' },
  { id: 3, tip: 'HEAD points to your current branch/commit. It\'s like your "you are here" marker.', icon: '👉' },
  { id: 4, tip: 'Merge preserves history, rebase rewrites it. Choose based on your team\'s workflow.', icon: '🔀' },
  { id: 5, tip: 'The staging area (index) lets you craft precise commits. Use it wisely!', icon: '🎯' },
  { id: 6, tip: 'Remote branches are read-only locally. Fetch updates them, push writes to them.', icon: '☁️' },
  { id: 7, tip: 'Cherry-picking copies commits, it doesn\'t move them. Original stays put!', icon: '🍒' },
  { id: 8, tip: 'Force push rewrites history. Never use it on shared branches!', icon: '⚠️' },
];

const glossary = [
  { term: 'Working Directory', def: 'Your local file system where you edit files.' },
  { term: 'Staging Area (Index)', def: 'A snapshot of changes ready for the next commit.' },
  { term: 'Repository', def: 'The .git folder containing all commits and history.' },
  { term: 'Commit Hash (SHA)', def: 'Unique identifier for each commit, looks like a1b2c3d.' },
  { term: 'HEAD', def: 'Pointer to your current branch or commit.' },
  { term: 'Detached HEAD', def: 'When HEAD points to a commit instead of a branch.' },
  { term: 'Fast-forward', def: 'Merge type when target branch is directly ahead.' },
  { term: 'Three-way Merge', def: 'Merge that creates a new commit with two parents.' },
  { term: 'Upstream', def: 'The remote repository you track (usually origin).' },
  { term: 'Origin', def: 'Default name for the main remote repository.' },
  { term: 'Merge Conflict', def: 'When Git can\'t automatically combine changes.' },
  { term: 'Stash', def: 'Temporary storage for uncommitted changes.' },
];

export const ExplanationPanel = ({ selectedConcept }: ExplanationPanelProps) => {
  const [randomTip] = useState(quickTips[Math.floor(Math.random() * quickTips.length)]);

  const concepts = Object.entries(gitConcepts).map(([key, value]) => ({
    key,
    ...value
  }));

  return (
    <Card className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Book size={24} className="text-primary" weight="bold" />
          <h3 className="font-semibold text-lg">Git Concepts</h3>
        </div>
      </div>

      <Tabs defaultValue={selectedConcept ? 'concepts' : 'tips'} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="tips" className="gap-2">
            <Lightbulb size={16} />
            Tips
          </TabsTrigger>
          <TabsTrigger value="concepts" className="gap-2">
            <Sparkle size={16} />
            Concepts
          </TabsTrigger>
          <TabsTrigger value="glossary" className="gap-2">
            <Question size={16} />
            Glossary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tips" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-accent/10 border border-accent/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{randomTip.icon}</span>
                  <div>
                    <Badge variant="secondary" className="mb-2">Quick Tip</Badge>
                    <p className="text-sm leading-relaxed">{randomTip.tip}</p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-3">
                {quickTips.filter(t => t.id !== randomTip.id).map((tip, index) => (
                  <motion.div
                    key={tip.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <span className="text-xl">{tip.icon}</span>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                      {tip.tip}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="concepts" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {concepts.map((concept, index) => (
                <motion.div
                  key={concept.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedConcept === concept.key
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{concept.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{concept.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {concept.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="glossary" className="flex-1 mt-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {glossary.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.02 }}
                  className="p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <dt className="font-semibold text-sm mb-1 text-foreground">
                    {item.term}
                  </dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">
                    {item.def}
                  </dd>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
