import { GitCommit, GitRepository } from './types';

export interface CommitNode extends GitCommit {
  x: number;
  y: number;
  column: number;
  row: number;
}

export interface Edge {
  from: CommitNode;
  to: CommitNode;
  isMerge?: boolean;
}

export const calculateLayout = (repository: GitRepository): { nodes: CommitNode[]; edges: Edge[] } => {
  const commits = repository.commits;
  const commitMap = new Map<string, GitCommit>(commits.map(c => [c.id, c]));
  
  const sortedCommits = [...commits].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const columns = new Map<string, number>();
  const rows = new Map<string, number>();
  let currentColumn = 0;

  const assignPosition = (commit: GitCommit, row: number, column: number) => {
    if (!rows.has(commit.id)) {
      rows.set(commit.id, row);
      columns.set(commit.id, column);
    }
  };

  const branchColumns = new Map<string, number>();
  
  sortedCommits.forEach((commit, index) => {
    if (!branchColumns.has(commit.branch)) {
      branchColumns.set(commit.branch, currentColumn++);
    }
    
    const column = branchColumns.get(commit.branch)!;
    assignPosition(commit, index, column);
  });

  const VERTICAL_SPACING = 80;
  const HORIZONTAL_SPACING = 120;

  const nodes: CommitNode[] = sortedCommits.map(commit => ({
    ...commit,
    row: rows.get(commit.id)!,
    column: columns.get(commit.id)!,
    x: columns.get(commit.id)! * HORIZONTAL_SPACING + 100,
    y: rows.get(commit.id)! * VERTICAL_SPACING + 80
  }));

  const nodeMap = new Map<string, CommitNode>(nodes.map(n => [n.id, n]));

  const edges: Edge[] = [];
  nodes.forEach(node => {
    node.parents.forEach(parentId => {
      const parent = nodeMap.get(parentId);
      if (parent) {
        edges.push({
          from: parent,
          to: node,
          isMerge: node.parents.length > 1
        });
      }
    });
  });

  return { nodes, edges };
};

export const filterCommits = (
  repository: GitRepository,
  filters: {
    branches?: string[];
    authors?: string[];
    searchQuery?: string;
  }
): GitRepository => {
  let filtered = [...repository.commits];

  if (filters.branches && filters.branches.length > 0) {
    filtered = filtered.filter(c => filters.branches!.includes(c.branch));
  }

  if (filters.authors && filters.authors.length > 0) {
    filtered = filtered.filter(c => filters.authors!.includes(c.author.name));
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(c => 
      c.message.toLowerCase().includes(query) ||
      c.hash.toLowerCase().includes(query) ||
      c.author.name.toLowerCase().includes(query)
    );
  }

  return {
    ...repository,
    commits: filtered
  };
};

export const getCommitColor = (commit: GitCommit, branch?: { color: string }): string => {
  if (commit.isRemote) return 'oklch(0.70 0.08 240)';
  if (branch) return branch.color;
  
  const branchColors: Record<string, string> = {
    main: 'oklch(0.55 0.12 155)',
    master: 'oklch(0.55 0.12 155)',
    develop: 'oklch(0.65 0.10 200)',
    default: 'oklch(0.72 0.15 60)'
  };
  
  return branchColors[commit.branch] || branchColors.default;
};
