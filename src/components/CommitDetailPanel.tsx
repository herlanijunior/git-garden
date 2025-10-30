import { GitCommit } from '@/lib/types';
import { getAnimalEmoji } from '@/lib/mockData';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { GitBranch, GitCommit as GitCommitIcon, User, Clock } from '@phosphor-icons/react';

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
            <span className="text-4xl">{getAnimalEmoji(commit.author.animal)}</span>
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
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <GitCommitIcon size={16} />
              Message
            </h3>
            <p className="text-base">{commit.message}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <User size={16} />
              Author
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getAnimalEmoji(commit.author.animal)}</span>
              <span>{commit.author.name}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Clock size={16} />
              Timestamp
            </h3>
            <p className="text-sm">
              {commit.timestamp.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(commit.timestamp, { addSuffix: true })}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <GitBranch size={16} />
              Branch
            </h3>
            <Badge variant={commit.isRemote ? 'outline' : 'default'}>
              {commit.branch}
            </Badge>
          </div>

          {commit.parents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Parent Commits
              </h3>
              <div className="flex flex-col gap-1">
                {commit.parents.map(parent => (
                  <code key={parent} className="text-xs mono bg-muted px-2 py-1 rounded">
                    {parent}
                  </code>
                ))}
              </div>
              {commit.parents.length > 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ✨ This is a merge commit
                </p>
              )}
            </div>
          )}

          {commit.isRemote && (
            <div className="p-4 bg-secondary/20 rounded-lg border border-secondary">
              <p className="text-sm flex items-center gap-2">
                <span>☁️</span>
                <span>This is a remote commit</span>
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
