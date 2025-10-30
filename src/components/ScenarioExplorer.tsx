import { useState } from 'react';
import { Scenario } from '@/lib/types';
import { scenarios, gitConcepts } from '@/lib/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConceptTooltip } from '@/components/ConceptTooltip';
import { Play, Question, ArrowRight, Sparkle } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface ScenarioExplorerProps {
  onScenarioSelect: (scenario: Scenario) => void;
}

export const ScenarioExplorer = ({ onScenarioSelect }: ScenarioExplorerProps) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleStartScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowChallenge(true);
  };

  const handleAnswerSubmit = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    if (selectedScenario) {
      onScenarioSelect(selectedScenario);
      setShowChallenge(false);
      setShowResult(false);
      setSelectedAnswer(null);
      setSelectedScenario(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold mb-2">Learning Scenarios</h2>
          <ConceptTooltip
            title="Interactive Learning"
            explanation="Each scenario teaches a specific Git concept through visual demonstrations and challenges. Complete them to master version control!"
            emoji="🎓"
          />
        </div>
        <p className="text-muted-foreground">
          Interactive scenarios to understand Git operations visually
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary/50" 
                  onClick={() => handleStartScenario(scenario)}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {scenario.title}
                    {scenario.difficulty === 'advanced' && (
                      <Sparkle size={16} className="text-accent" weight="fill" />
                    )}
                  </CardTitle>
                  <Badge className={getDifficultyColor(scenario.difficulty)}>
                    {scenario.difficulty}
                  </Badge>
                </div>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {scenario.steps.length} steps
                  </span>
                  <Button size="sm" className="gap-2">
                    <Play size={16} weight="fill" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Git Concepts
          <ConceptTooltip
            title="Core Concepts"
            explanation="Understanding these fundamental concepts will help you master Git and collaborate effectively with your team."
            emoji="📚"
          />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(gitConcepts).map(([key, concept], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{concept.emoji}</span>
                  <div>
                    <h4 className="font-medium mb-1">{concept.title}</h4>
                    <p className="text-sm text-muted-foreground">{concept.explanation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Dialog open={showChallenge} onOpenChange={setShowChallenge}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Question size={24} weight="fill" className="text-accent" />
              Challenge Question
            </DialogTitle>
            <DialogDescription>
              Test your understanding before starting the scenario
            </DialogDescription>
          </DialogHeader>

          {selectedScenario?.challengeQuestion && (
            <div className="space-y-4">
              <p className="text-base font-medium">
                {selectedScenario.challengeQuestion.question}
              </p>

              <div className="space-y-2">
                {selectedScenario.challengeQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedAnswer === index
                        ? showResult
                          ? index === selectedScenario.challengeQuestion!.correctAnswer
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-red-500 bg-red-50 dark:bg-red-950'
                          : 'border-primary bg-primary/5'
                        : showResult && index === selectedScenario.challengeQuestion!.correctAnswer
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <p className="text-sm">
                    {selectedScenario.challengeQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          <DialogFooter>
            {!showResult ? (
              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="gap-2"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleContinue} className="gap-2">
                Continue to Scenario
                <ArrowRight size={16} />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
