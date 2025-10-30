import { GitRepository, Scenario, GitCommit, AnimalType } from './types';

const animalEmojis: Record<AnimalType, string> = {
  duck: '🦆',
  cat: '🐱',
  dog: '🐶',
  bird: '🐦',
  chicken: '🐔',
  unicorn: '🦄',
  octocat: '🐙'
};

export const getAnimalEmoji = (animal: AnimalType): string => animalEmojis[animal];

const authors = [
  { name: 'Daisy Duck', animal: 'duck' as AnimalType },
  { name: 'Whiskers', animal: 'cat' as AnimalType },
  { name: 'Buddy', animal: 'dog' as AnimalType },
  { name: 'Tweety', animal: 'bird' as AnimalType },
  { name: 'Clucky', animal: 'chicken' as AnimalType },
  { name: 'Sparkle', animal: 'unicorn' as AnimalType },
  { name: 'Octo', animal: 'octocat' as AnimalType }
];

export const createSampleRepository = (): GitRepository => {
  const commits: GitCommit[] = [
    {
      id: 'c1',
      hash: 'a1b2c3d',
      message: 'Initial commit',
      author: authors[0],
      timestamp: new Date('2024-01-01T10:00:00'),
      parents: [],
      branch: 'main',
      files: [
        { path: '.gitignore', status: 'added', additions: 15, deletions: 0 },
        { path: 'package.json', status: 'added', additions: 25, deletions: 0 }
      ]
    },
    {
      id: 'c2',
      hash: 'e4f5g6h',
      message: 'Add README',
      author: authors[1],
      timestamp: new Date('2024-01-02T11:00:00'),
      parents: ['c1'],
      branch: 'main',
      files: [
        { path: 'README.md', status: 'added', additions: 42, deletions: 0 }
      ]
    },
    {
      id: 'c3',
      hash: 'i7j8k9l',
      message: 'Create basic structure',
      author: authors[2],
      timestamp: new Date('2024-01-03T09:00:00'),
      parents: ['c2'],
      branch: 'main',
      files: [
        { path: 'src/index.js', status: 'added', additions: 18, deletions: 0 },
        { path: 'src/App.js', status: 'added', additions: 35, deletions: 0 },
        { path: 'public/index.html', status: 'added', additions: 22, deletions: 0 }
      ]
    },
    {
      id: 'c4',
      hash: 'm0n1o2p',
      message: 'Start feature: login',
      author: authors[3],
      timestamp: new Date('2024-01-04T14:00:00'),
      parents: ['c3'],
      branch: 'feature/login',
      files: [
        { path: 'src/components/Login.js', status: 'added', additions: 52, deletions: 0 },
        { path: 'src/components/Login.css', status: 'added', additions: 28, deletions: 0 }
      ]
    },
    {
      id: 'c5',
      hash: 'q3r4s5t',
      message: 'Implement auth logic',
      author: authors[3],
      timestamp: new Date('2024-01-05T10:00:00'),
      parents: ['c4'],
      branch: 'feature/login',
      files: [
        { path: 'src/services/auth.js', status: 'added', additions: 78, deletions: 0 },
        { path: 'src/components/Login.js', status: 'modified', additions: 15, deletions: 8 },
        { path: 'package.json', status: 'modified', additions: 2, deletions: 0 }
      ]
    },
    {
      id: 'c6',
      hash: 'u6v7w8x',
      message: 'Fix header styling',
      author: authors[4],
      timestamp: new Date('2024-01-05T15:00:00'),
      parents: ['c3'],
      branch: 'main',
      files: [
        { path: 'src/components/Header.css', status: 'modified', additions: 12, deletions: 5 }
      ]
    },
    {
      id: 'c7',
      hash: 'y9z0a1b',
      message: 'Add tests for auth',
      author: authors[3],
      timestamp: new Date('2024-01-06T11:00:00'),
      parents: ['c5'],
      branch: 'feature/login',
      files: [
        { path: 'src/services/auth.test.js', status: 'added', additions: 95, deletions: 0 },
        { path: 'jest.config.js', status: 'added', additions: 12, deletions: 0 }
      ]
    },
    {
      id: 'c8',
      hash: 'c2d3e4f',
      message: 'Merge feature/login',
      author: authors[5],
      timestamp: new Date('2024-01-07T09:00:00'),
      parents: ['c6', 'c7'],
      branch: 'main',
      files: [
        { path: 'src/components/Login.js', status: 'added', additions: 67, deletions: 0 },
        { path: 'src/components/Login.css', status: 'added', additions: 28, deletions: 0 },
        { path: 'src/services/auth.js', status: 'added', additions: 78, deletions: 0 },
        { path: 'src/services/auth.test.js', status: 'added', additions: 95, deletions: 0 },
        { path: 'jest.config.js', status: 'added', additions: 12, deletions: 0 },
        { path: 'package.json', status: 'modified', additions: 2, deletions: 0 }
      ]
    },
    {
      id: 'c9',
      hash: 'g5h6i7j',
      message: 'Start dashboard feature',
      author: authors[6],
      timestamp: new Date('2024-01-08T10:00:00'),
      parents: ['c8'],
      branch: 'feature/dashboard',
      files: [
        { path: 'src/components/Dashboard.js', status: 'added', additions: 45, deletions: 0 }
      ]
    },
    {
      id: 'c10',
      hash: 'k8l9m0n',
      message: 'Add dashboard layout',
      author: authors[6],
      timestamp: new Date('2024-01-09T14:00:00'),
      parents: ['c9'],
      branch: 'feature/dashboard',
      files: [
        { path: 'src/components/Dashboard.js', status: 'modified', additions: 32, deletions: 12 },
        { path: 'src/components/Dashboard.css', status: 'added', additions: 58, deletions: 0 },
        { path: 'src/components/DashboardCard.js', status: 'added', additions: 28, deletions: 0 }
      ]
    },
    {
      id: 'c11',
      hash: 'o1p2q3r',
      message: 'Hotfix: login bug',
      author: authors[0],
      timestamp: new Date('2024-01-09T16:00:00'),
      parents: ['c8'],
      branch: 'main',
      files: [
        { path: 'src/services/auth.js', status: 'modified', additions: 3, deletions: 2 }
      ]
    },
    {
      id: 'c12',
      hash: 's4t5u6v',
      message: 'Update dependencies',
      author: authors[1],
      timestamp: new Date('2024-01-10T10:00:00'),
      parents: ['c11'],
      branch: 'main',
      files: [
        { path: 'package.json', status: 'modified', additions: 8, deletions: 8 },
        { path: 'package-lock.json', status: 'modified', additions: 245, deletions: 187 }
      ]
    }
  ];

  return {
    commits,
    branches: [
      {
        name: 'main',
        commits: ['c1', 'c2', 'c3', 'c6', 'c8', 'c11', 'c12'],
        color: 'oklch(0.55 0.12 155)'
      },
      {
        name: 'feature/login',
        commits: ['c4', 'c5', 'c7'],
        color: 'oklch(0.65 0.10 200)'
      },
      {
        name: 'feature/dashboard',
        commits: ['c9', 'c10'],
        color: 'oklch(0.72 0.15 60)'
      }
    ],
    head: 'c12',
    remoteBranches: [
      {
        name: 'origin/main',
        commits: ['c1', 'c2', 'c3', 'c6', 'c8'],
        isRemote: true,
        color: 'oklch(0.70 0.08 240)'
      }
    ]
  };
};

export const scenarios: Scenario[] = [
  {
    id: 'upstream-sync',
    title: 'Syncing with Upstream',
    description: 'Learn how to fetch and merge changes from a remote repository',
    difficulty: 'beginner',
    steps: [
      {
        title: 'Initial State',
        description: 'Your local main is behind the remote',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'fetch',
        explanation: 'The remote repository has new commits that you don\'t have locally yet.'
      }
    ],
    challengeQuestion: {
      question: 'What command fetches remote changes without merging?',
      options: ['git pull', 'git fetch', 'git merge', 'git push'],
      correctAnswer: 1,
      explanation: 'git fetch downloads commits from remote but doesn\'t merge them into your branch.'
    }
  },
  {
    id: 'cherry-pick',
    title: 'Cherry-picking Commits',
    description: 'Apply specific commits from one branch to another',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Select Commit',
        description: 'Choose a commit from feature branch to apply to main',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'cherry-pick',
        explanation: 'Cherry-pick creates a new commit with the same changes as the selected commit.'
      }
    ],
    challengeQuestion: {
      question: 'Does cherry-picking move the original commit?',
      options: ['Yes, it moves it', 'No, it creates a copy', 'It depends on the flags'],
      correctAnswer: 1,
      explanation: 'Cherry-pick creates a new commit with the same changes - the original commit stays on its branch.'
    }
  },
  {
    id: 'revert',
    title: 'Reverting Changes',
    description: 'Safely undo a commit by creating a new commit',
    difficulty: 'beginner',
    steps: [
      {
        title: 'Revert Commit',
        description: 'Create a new commit that undoes previous changes',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'revert',
        explanation: 'Revert creates a new commit that applies the inverse of the selected commit.'
      }
    ],
    challengeQuestion: {
      question: 'Why use revert instead of reset on public branches?',
      options: [
        'Reset is slower',
        'Revert preserves history',
        'Reset doesn\'t work on public branches',
        'They do the same thing'
      ],
      correctAnswer: 1,
      explanation: 'Revert preserves history by creating a new commit, while reset rewrites history which can cause problems for collaborators.'
    }
  },
  {
    id: 'force-push',
    title: 'Force Push (Dangerous!)',
    description: 'Understand the risks of rewriting remote history',
    difficulty: 'advanced',
    steps: [
      {
        title: 'Rewritten History',
        description: 'Local branch has been rebased, remote has old commits',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'force-push',
        explanation: 'Force push overwrites remote history - dangerous if others are working on the same branch!'
      }
    ],
    challengeQuestion: {
      question: 'When is force push acceptable?',
      options: [
        'Never',
        'Always on main branch',
        'On your own feature branches',
        'Whenever you want'
      ],
      correctAnswer: 2,
      explanation: 'Force push is generally safe on your own feature branches, but dangerous on shared branches like main.'
    }
  },
  {
    id: 'merge-conflict',
    title: 'Handling Merge Conflicts',
    description: 'Visualize and resolve conflicting changes',
    difficulty: 'intermediate',
    steps: [
      {
        title: 'Conflicting Changes',
        description: 'Two branches modified the same file differently',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'merge',
        explanation: 'When Git can\'t automatically merge changes, you need to manually resolve conflicts.'
      }
    ],
    challengeQuestion: {
      question: 'What creates a merge conflict?',
      options: [
        'Merging any two branches',
        'Changes to different files',
        'Changes to the same lines in different ways',
        'Too many commits'
      ],
      correctAnswer: 2,
      explanation: 'Conflicts occur when the same lines are modified differently in branches being merged.'
    }
  },
  {
    id: 'rebase',
    title: 'Rebasing Branches',
    description: 'Move commits to a new base',
    difficulty: 'advanced',
    steps: [
      {
        title: 'Rebase Feature',
        description: 'Replay feature commits on top of updated main',
        before: createSampleRepository(),
        after: createSampleRepository(),
        operation: 'rebase',
        explanation: 'Rebase rewrites commits to appear as if they were made from the current tip of the base branch.'
      }
    ],
    challengeQuestion: {
      question: 'What\'s the main difference between merge and rebase?',
      options: [
        'Rebase is faster',
        'Merge creates a merge commit, rebase rewrites history',
        'They\'re the same',
        'Rebase only works locally'
      ],
      correctAnswer: 1,
      explanation: 'Merge preserves history with a merge commit; rebase creates a linear history by replaying commits.'
    }
  }
];

export const gitConcepts = {
  commit: {
    title: 'Commit',
    explanation: 'A snapshot of your repository at a specific point in time. Each commit has a unique hash and points to its parent commit(s).',
    emoji: '📸'
  },
  branch: {
    title: 'Branch',
    explanation: 'A lightweight movable pointer to a commit. Branches let you work on different features independently.',
    emoji: '🌿'
  },
  merge: {
    title: 'Merge',
    explanation: 'Combines changes from different branches. Creates a merge commit with multiple parents.',
    emoji: '🔀'
  },
  rebase: {
    title: 'Rebase',
    explanation: 'Moves commits to a new base commit, rewriting history to create a linear progression.',
    emoji: '📝'
  },
  'cherry-pick': {
    title: 'Cherry-pick',
    explanation: 'Applies the changes from a specific commit to your current branch, creating a new commit.',
    emoji: '🍒'
  },
  revert: {
    title: 'Revert',
    explanation: 'Creates a new commit that undoes the changes from a previous commit without rewriting history.',
    emoji: '⏮️'
  },
  fetch: {
    title: 'Fetch',
    explanation: 'Downloads commits and refs from a remote repository without merging them into your work.',
    emoji: '📥'
  },
  pull: {
    title: 'Pull',
    explanation: 'Fetches from remote and merges changes into your current branch (fetch + merge).',
    emoji: '⬇️'
  },
  push: {
    title: 'Push',
    explanation: 'Uploads your local commits to a remote repository.',
    emoji: '⬆️'
  },
  'force-push': {
    title: 'Force Push',
    explanation: 'Overwrites remote history with your local history. Dangerous on shared branches!',
    emoji: '⚠️'
  },
  head: {
    title: 'HEAD',
    explanation: 'A pointer to the current commit you\'re working from. Usually points to the tip of a branch.',
    emoji: '👉'
  },
  remote: {
    title: 'Remote',
    explanation: 'A version of your repository hosted on the internet or network. Origin is the default remote name.',
    emoji: '☁️'
  }
};
