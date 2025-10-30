import { GitCommit } from '@/lib/types';
import { getAnimalEmoji } from '@/lib/mockData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ConceptTooltip } from '@/components/ConceptTooltip';
import { formatDistanceToNow } from 'date-fns';
import { GitBranch, GitCommit as GitCommitIcon, User, Clock, File, FilePlus, FileMinus, FileArrowUp } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface CommitDetailPanelProps {
  commit: GitCommit | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CommitDetailPanel = ({ commit, isOpen, onClose }: CommitDetailPanelProps) => {
  if (!commit) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <motion.span
              className="text-4xl"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              {getAnimalEmoji(commit.author.animal)}
            </motion.span>
            <div>
              <div className="text-sm text-muted-foreground mono">
                {commit.hash}
              </div>
            </div>
          </SheetTitle>
          <SheetDescription>
            Commit Details
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <GitCommitIcon size={16} />
              Message
              <ConceptTooltip
                title="Commit Message"
                explanation="A description of what changes this commit contains. Good messages help your team understand the project history."
                emoji="💬"
              />
            </h3>
            <p className="text-base">{commit.message}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <User size={16} />
              Author
              <ConceptTooltip
                title="Commit Author"
                explanation="The person who created this commit. Git tracks who makes changes for accountability and collaboration."
                emoji="👤"
              />
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getAnimalEmoji(commit.author.animal)}</span>
              <span>{commit.author.name}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock size={16} />
              Timestamp
              <ConceptTooltip
                title="Commit Time"
                explanation="When this commit was created. Git uses timestamps to order commits chronologically."
                emoji="⏰"
              />
            </h3>
            <p className="text-sm">
              {commit.timestamp.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(commit.timestamp, { addSuffix: true })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <GitBranch size={16} />
              Branch
              <ConceptTooltip
                title="Branch"
                explanation="The branch this commit belongs to. Branches let you develop features independently from the main codebase."
                emoji="🌿"
              />
            </h3>
            <Badge variant={commit.isRemote ? 'outline' : 'default'}>
              {commit.branch}
            </Badge>
          </motion.div>

          {commit.parents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                Parent Commits
                <ConceptTooltip
                  title="Parent Commits"
                  explanation="Every commit (except the first) has one or more parent commits. Multiple parents indicate a merge commit."
                  emoji="👪"
                />
              </h3>
              <div className="flex flex-col gap-1">
                {commit.parents.map((parent, index) => (
                  <motion.code
                    key={parent}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="text-xs mono bg-muted px-2 py-1 rounded"
                  >
                    {parent}
                  </motion.code>
                ))}
              </div>
              {commit.parents.length > 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-muted-foreground mt-2 flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>This is a merge commit</span>
                  <ConceptTooltip
                    title="Merge Commit"
                    explanation="A commit with multiple parents, created when branches are merged together. It combines the history of both branches."
                    emoji="🔀"
                  />
                </motion.p>
              )}
            </motion.div>
          )}

          {commit.files && commit.files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <File size={16} />
                Changed Files
                <ConceptTooltip
                  title="Changed Files"
                  explanation="Files that were added, modified, deleted, or renamed in this commit. Each change contributes to the commit's snapshot."
                  emoji="📄"
                />
              </h3>
              <div className="space-y-2">
                {commit.files.map((file, index) => {
                  const statusConfig = {
                    added: { 
                      icon: <FilePlus size={16} weight="bold" />, 
                      color: 'text-primary', 
                      bg: 'bg-primary/10',
                      label: 'A' 
                    },
                    modified: { 
                      icon: <File size={16} weight="bold" />, 
                      color: 'text-accent', 
                      bg: 'bg-accent/10',
                      label: 'M' 
                    },
                    deleted: { 
                      icon: <FileMinus size={16} weight="bold" />, 
                      color: 'text-destructive', 
                      bg: 'bg-destructive/10',
                      label: 'D' 
                    },
                    renamed: { 
                      icon: <FileArrowUp size={16} weight="bold" />, 
                      color: 'text-secondary', 
                      bg: 'bg-secondary/10',
                      label: 'R' 
                    }
                  };
                  
                  const config = statusConfig[file.status];
                  
                  return (
                    <motion.div
                      key={`${file.path}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`flex items-center justify-center w-6 h-6 rounded ${config.bg} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mono truncate" title={file.path}>
                          {file.path}
                        </p>
                        {file.status === 'renamed' && file.oldPath && (
                          <p className="text-xs text-muted-foreground mono truncate" title={file.oldPath}>
                            from: {file.oldPath}
                          </p>
                        )}
                        {(file.additions !== undefined || file.deletions !== undefined) && (
                          <div className="flex gap-2 text-xs mt-1">
                            {file.additions !== undefined && file.additions > 0 && (
                              <span className="text-primary">+{file.additions}</span>
                            )}
                            {file.deletions !== undefined && file.deletions > 0 && (
                              <span className="text-destructive">-{file.deletions}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {config.label}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {commit.isRemote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="p-4 bg-secondary/20 rounded-lg border border-secondary"
            >
              <p className="text-sm flex items-center gap-2">
                <span>☁️</span>
                <span>This is a remote commit</span>
                <ConceptTooltip
                  title="Remote Commit"
                  explanation="Commits that exist on the remote repository. They're read-only locally until you fetch and merge them."
                  emoji="☁️"
                />
              </p>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
