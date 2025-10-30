import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, ArrowUp, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { gitConcepts } from '@/lib/mockData';

interface CommandHistory {
  command: string;
  output: string;
  type: 'success' | 'error' | 'info';
  timestamp: Date;
}

interface CommandInputProps {
  onCommandExecute?: (command: string) => void;
}

const gitCommands = [
  { cmd: 'git status', desc: 'Show the working tree status', emoji: '📊' },
  { cmd: 'git log', desc: 'Show commit logs', emoji: '📜' },
  { cmd: 'git branch', desc: 'List, create, or delete branches', emoji: '🌿' },
  { cmd: 'git checkout', desc: 'Switch branches or restore files', emoji: '↔️' },
  { cmd: 'git commit', desc: 'Record changes to the repository', emoji: '📸' },
  { cmd: 'git merge', desc: 'Join two or more branches', emoji: '🔀' },
  { cmd: 'git rebase', desc: 'Reapply commits on top of another base', emoji: '📝' },
  { cmd: 'git cherry-pick', desc: 'Apply changes from specific commits', emoji: '🍒' },
  { cmd: 'git revert', desc: 'Revert some existing commits', emoji: '⏮️' },
  { cmd: 'git fetch', desc: 'Download objects from remote', emoji: '📥' },
  { cmd: 'git pull', desc: 'Fetch and integrate with local branch', emoji: '⬇️' },
  { cmd: 'git push', desc: 'Update remote refs along with objects', emoji: '⬆️' },
  { cmd: 'git reset', desc: 'Reset current HEAD to specified state', emoji: '🔄' },
  { cmd: 'git stash', desc: 'Stash changes in a dirty working directory', emoji: '💾' },
  { cmd: 'git diff', desc: 'Show changes between commits, trees, etc', emoji: '🔍' },
  { cmd: 'help', desc: 'Show available commands', emoji: '❓' },
];

export const CommandInput = ({ onCommandExecute }: CommandInputProps) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<typeof gitCommands>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (command.trim()) {
      const filtered = gitCommands.filter(
        cmd => cmd.cmd.toLowerCase().includes(command.toLowerCase()) ||
               cmd.desc.toLowerCase().includes(command.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [command]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    const newHistory: CommandHistory = {
      command: trimmedCmd,
      output: '',
      type: 'info',
      timestamp: new Date()
    };

    if (trimmedCmd === 'clear') {
      setHistory([]);
      setCommand('');
      return;
    }

    if (trimmedCmd === 'help') {
      newHistory.output = 'Available commands:\n\n' + 
        gitCommands.map(c => `${c.emoji} ${c.cmd.padEnd(20)} - ${c.desc}`).join('\n');
      newHistory.type = 'success';
    } else if (trimmedCmd.startsWith('git ')) {
      const operation = trimmedCmd.split(' ')[1];
      const conceptKey = operation === 'cherry-pick' ? 'cherry-pick' : 
                        operation === 'force-push' ? 'force-push' : operation;
      
      const concept = gitConcepts[conceptKey as keyof typeof gitConcepts];
      
      if (concept) {
        newHistory.output = `${concept.emoji} ${concept.title}\n\n${concept.explanation}\n\nNote: This is a learning visualization. Commands are simulated.`;
        newHistory.type = 'success';
        toast.success(`Learning about: ${concept.title}`);
      } else {
        newHistory.output = `Command '${trimmedCmd}' simulated.\n\nTip: Try 'help' to see available commands and their explanations.`;
        newHistory.type = 'info';
      }
      
      onCommandExecute?.(trimmedCmd);
    } else {
      newHistory.output = `Unknown command: '${trimmedCmd}'\n\nTry 'help' for available commands.`;
      newHistory.type = 'error';
    }

    setHistory(prev => [...prev, newHistory]);
    setCommand('');
    setHistoryIndex(-1);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(command);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const cmdHistory = history.map(h => h.command);
      if (cmdHistory.length > 0) {
        const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const cmdHistory = history.map(h => h.command);
      if (historyIndex !== -1) {
        const newIndex = Math.min(cmdHistory.length - 1, historyIndex + 1);
        if (newIndex === cmdHistory.length - 1) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(cmdHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setCommand(suggestions[0].cmd);
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (cmd: string) => {
    setCommand(cmd);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <Card className="flex flex-col h-full bg-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Terminal size={24} className="text-primary" weight="bold" />
        <div>
          <h3 className="font-semibold text-lg">Git Terminal</h3>
          <p className="text-xs text-muted-foreground">Practice Git commands interactively</p>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistory([])}
            className="ml-auto"
          >
            <X size={16} />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3 font-mono text-sm">
          <AnimatePresence>
            {history.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary">$</span>
                  <span className="text-foreground">{entry.command}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {entry.timestamp.toLocaleTimeString()}
                  </Badge>
                </div>
                {entry.output && (
                  <pre className={`pl-4 whitespace-pre-wrap text-xs ${
                    entry.type === 'error' ? 'text-destructive' :
                    entry.type === 'success' ? 'text-primary' :
                    'text-muted-foreground'
                  }`}>
                    {entry.output}
                  </pre>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-2">
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono">$</span>
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a git command... (try 'help')"
              className="font-mono flex-1"
              autoComplete="off"
            />
            <Button
              onClick={() => executeCommand(command)}
              size="sm"
              disabled={!command.trim()}
            >
              <ArrowUp size={16} />
            </Button>
          </div>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
              >
                <div className="p-2 text-xs text-muted-foreground border-b border-border">
                  Suggestions (press Tab to autocomplete)
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion.cmd)}
                      className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-start gap-2"
                    >
                      <span className="text-lg">{suggestion.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-medium">{suggestion.cmd}</div>
                        <div className="text-xs text-muted-foreground truncate">{suggestion.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 bg-muted rounded">↑↓</kbd>
          <span>History</span>
          <kbd className="px-2 py-1 bg-muted rounded ml-auto">Tab</kbd>
          <span>Autocomplete</span>
        </div>
      </div>
    </Card>
  );
};
