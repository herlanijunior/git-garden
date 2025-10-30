export type AnimalType = 'duck' | 'cat' | 'dog' | 'bird' | 'chicken' | 'unicorn' | 'octocat';

export interface GitCommit {
  id: string;
  hash: string;
  message: string;
  author: {
    name: string;
    animal: AnimalType;
  };
  timestamp: Date;
  parents: string[];
  branch: string;
  isRemote?: boolean;
  x?: number;
  y?: number;
}

export interface GitBranch {
  name: string;
  commits: string[];
  isRemote?: boolean;
  tracking?: string;
  color: string;
}

export interface GitRepository {
  commits: GitCommit[];
  branches: GitBranch[];
  head: string;
  remoteBranches?: GitBranch[];
}

export interface ScenarioStep {
  title: string;
  description: string;
  before: GitRepository;
  after: GitRepository;
  operation: 'commit' | 'merge' | 'rebase' | 'cherry-pick' | 'revert' | 'force-push' | 'fetch' | 'pull';
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: ScenarioStep[];
  challengeQuestion?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

export interface FilterState {
  branches: string[];
  authors: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}
