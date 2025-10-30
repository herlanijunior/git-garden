import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ConceptTooltip } from '@/components/ConceptTooltip';
import { Play, Pause, FastForward, Rewind, Clock } from '@phosphor-icons/react';
import { GitCommit } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface TimelinePlayerProps {
  commits: GitCommit[];
  onTimelineUpdate: (visibleCommitIds: string[]) => void;
}

export const TimelinePlayer = ({ commits, onTimelineUpdate }: TimelinePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(commits.length - 1);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | undefined>(undefined);

  const sortedCommits = [...commits].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= sortedCommits.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, sortedCommits.length]);

  useEffect(() => {
    const visibleCommits = sortedCommits.slice(0, currentIndex + 1).map(c => c.id);
    onTimelineUpdate(visibleCommits);
  }, [currentIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleEnd = () => {
    setIsPlaying(false);
    setCurrentIndex(sortedCommits.length - 1);
  };

  const handleSliderChange = (value: number[]) => {
    setCurrentIndex(value[0]);
    setIsPlaying(false);
  };

  const currentCommit = sortedCommits[currentIndex];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Timeline Playback
              <ConceptTooltip
                title="Timeline Playback"
                explanation="Watch your repository evolve over time! Use the timeline to see commits appear chronologically and understand how the project developed."
                emoji="⏱️"
              />
            </h3>
            <Badge variant="secondary">
              {currentIndex + 1} / {sortedCommits.length}
            </Badge>
          </div>

          {currentCommit && (
            <motion.div
              key={currentCommit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs mono text-muted-foreground">
                  {currentCommit.hash}
                </span>
                <Badge variant="outline" className="text-xs">
                  {currentCommit.branch}
                </Badge>
              </div>
              <p className="text-sm">{currentCommit.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {currentCommit.timestamp.toLocaleDateString()} at{' '}
                {currentCommit.timestamp.toLocaleTimeString()}
              </p>
            </motion.div>
          )}

          <div className="space-y-2">
            <Slider
              value={[currentIndex]}
              onValueChange={handleSliderChange}
              max={sortedCommits.length - 1}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <ConceptTooltip
                title="Reset Timeline"
                explanation="Jump to the first commit in the timeline."
                emoji="⏮️"
                asChild
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  disabled={currentIndex === 0}
                >
                  <Rewind size={16} />
                </Button>
              </ConceptTooltip>
              <ConceptTooltip
                title={isPlaying ? "Pause" : "Play Timeline"}
                explanation={isPlaying ? "Pause the automatic playback." : "Watch commits appear automatically over time."}
                emoji={isPlaying ? "⏸️" : "▶️"}
                asChild
              >
                <Button
                  size="sm"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
                </Button>
              </ConceptTooltip>
              <ConceptTooltip
                title="Jump to End"
                explanation="Skip to the most recent commit."
                emoji="⏭️"
                asChild
              >
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEnd}
                  disabled={currentIndex === sortedCommits.length - 1}
                >
                  <FastForward size={16} />
                </Button>
              </ConceptTooltip>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                Speed:
                <ConceptTooltip
                  title="Playback Speed"
                  explanation="Control how fast commits appear during automatic playback. Higher speeds help you quickly scan through history."
                  emoji="⚡"
                />
              </span>
              <div className="flex gap-1">
                {[0.5, 1, 2, 3].map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={speed === s ? 'default' : 'outline'}
                    onClick={() => setSpeed(s)}
                    className="w-12"
                  >
                    {s}x
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
