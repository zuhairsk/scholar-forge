export type User = {
  id: string;
  name: string;
  role: 'author' | 'reviewer' | 'admin';
  avatar: string;
  institution: string;
  domain: string;
  level: number;
  levelName: string;
  xp: number;
  reviewsCompleted: number;
};

export type Paper = {
  id: string;
  title: string;
  abstract: string;
  domain: string;
  status: 'Draft' | 'Submitted' | 'Matched' | 'Under Review' | 'Revision Requested' | 'Published';
  score?: number;
  authors: string[];
  submittedAt: string;
  readTime: number;
  downloads: number;
  tags: string[];
};

export type Review = {
  id: string;
  paperId: string;
  reviewerId: string;
  scores: { clarity: number; methodology: number; novelty: number; impact: number; reproducibility: number };
  recommendation: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  summary: string;
  strengths: string;
  weaknesses: string;
  helpfulVotes: number;
  date: string;
};

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Amara Osei', role: 'reviewer', avatar: 'AO', institution: 'MIT', domain: 'Computational Biology', level: 4, levelName: 'Expert', xp: 2340, reviewsCompleted: 42 },
  { id: 'u2', name: 'Prof. Lena Fischer', role: 'reviewer', avatar: 'LF', institution: 'Max Planck Institute', domain: 'Quantum Physics', level: 5, levelName: 'Distinguished', xp: 3800, reviewsCompleted: 89 },
  { id: 'u3', name: 'Dr. Ravi Sharma', role: 'reviewer', avatar: 'RS', institution: 'Stanford', domain: 'Machine Learning', level: 3, levelName: 'Fellow', xp: 1450, reviewsCompleted: 15 },
  { id: 'u4', name: 'Dr. Sofia Reyes', role: 'reviewer', avatar: 'SR', institution: 'Oxford', domain: 'Neuroscience', level: 2, levelName: 'Scholar', xp: 780, reviewsCompleted: 7 },
  { id: 'u5', name: 'James Chen', role: 'reviewer', avatar: 'JC', institution: 'Berkeley', domain: 'Computer Vision', level: 1, levelName: 'Initiate', xp: 210, reviewsCompleted: 2 },
  { id: 'u6', name: 'Dr. Elena Rostova', role: 'author', avatar: 'ER', institution: 'CERN', domain: 'Physics', level: 2, levelName: 'Author', xp: 400, reviewsCompleted: 0 },
];

export const CURRENT_USER = MOCK_USERS[0]; // Assume Amara is logged in for reviewer views

export const MOCK_PAPERS: Paper[] = [
  { id: 'p1', title: 'Attention Mechanisms in Multi-Modal Learning', abstract: 'We introduce a novel attention mechanism that dynamically weights modalities...', domain: 'Computer Science', status: 'Under Review', authors: ['Alex Vance', 'Sarah Jenkins'], submittedAt: '2025-01-12', readTime: 18, downloads: 45, tags: ['AI', 'Deep Learning'] },
  { id: 'p2', title: 'CRISPR-Cas9 Off-Target Effects in Stem Cells', abstract: 'A comprehensive longitudinal study of off-target edits using high-throughput sequencing...', domain: 'Biology', status: 'Published', score: 9.1, authors: ['Dr. Elena Rostova'], submittedAt: '2024-11-05', readTime: 24, downloads: 1204, tags: ['Genetics', 'CRISPR'] },
  { id: 'p3', title: 'Quantum Entanglement in Photonic Networks', abstract: 'Demonstrating stable entanglement routing across a 50-node simulated optical network...', domain: 'Physics', status: 'Under Review', authors: ['Wei Lin', 'Hans Mueller'], submittedAt: '2025-01-14', readTime: 15, downloads: 12, tags: ['Quantum', 'Networks'] },
  { id: 'p4', title: 'Neural Correlates of Decision Making Under Uncertainty', abstract: 'fMRI analysis reveals distinct pathways when subjects are presented with ambiguous rewards...', domain: 'Neuroscience', status: 'Published', score: 7.8, authors: ['Dr. Sofia Reyes'], submittedAt: '2024-09-22', readTime: 30, downloads: 850, tags: ['fMRI', 'Cognition'] },
  { id: 'p5', title: 'Federated Learning for Privacy-Preserving NLP', abstract: 'A framework for training large language models without centralizing user text data...', domain: 'Computer Science', status: 'Submitted', authors: ['James Chen'], submittedAt: '2025-01-18', readTime: 20, downloads: 5, tags: ['NLP', 'Privacy'] },
  { id: 'p6', title: 'Climate Model Uncertainty Quantification', abstract: 'Improving the bounded accuracy of century-scale climate predictions using Bayesian neural networks.', domain: 'Environmental', status: 'Under Review', authors: ['Anna K'], submittedAt: '2025-01-10', readTime: 22, downloads: 34, tags: ['Climate', 'Bayesian'] },
  { id: 'p7', title: 'Graph Neural Networks for Drug Discovery', abstract: 'Predicting molecular binding affinities with 94% accuracy using spatial graph representations.', domain: 'Chemistry', status: 'Published', score: 8.7, authors: ['David O.', 'Marcus R.'], submittedAt: '2024-12-01', readTime: 14, downloads: 420, tags: ['GNN', 'Pharma'] },
  { id: 'p8', title: 'Transformer Architectures for Time-Series Forecasting', abstract: 'Adapting the transformer block to handle continuous temporal data streams with seasonal patterns.', domain: 'Computer Science', status: 'Revision Requested', authors: ['Dr. Ravi Sharma'], submittedAt: '2025-01-05', readTime: 16, downloads: 88, tags: ['Transformers', 'Time-Series'] },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 'r1', paperId: 'p2', reviewerId: 'u2', scores: { clarity: 9, methodology: 10, novelty: 8, impact: 9, reproducibility: 9 }, recommendation: 'Accept', summary: 'A landmark paper in the field of genetics. The methodology is incredibly sound.', strengths: 'Exceptional longitudinal data. Clear methodology.', weaknesses: 'Discussion could expand more on ethical implications.', helpfulVotes: 42, date: '2024-11-20' },
  { id: 'r2', paperId: 'p4', reviewerId: 'u1', scores: { clarity: 8, methodology: 7, novelty: 8, impact: 8, reproducibility: 7 }, recommendation: 'Minor Revision', summary: 'Solid fMRI work, but the sample size is borderline for the claims made.', strengths: 'Novel paradigm for uncertainty.', weaknesses: 'Sample size (n=24) limits generalizability.', helpfulVotes: 15, date: '2024-10-15' },
];

export const DOMAIN_COLORS: Record<string, string> = {
  'Computer Science': 'hsl(210, 100%, 60%)', // Blue
  'Biology': 'hsl(140, 70%, 50%)', // Green
  'Physics': 'hsl(280, 80%, 60%)', // Purple
  'Neuroscience': 'hsl(320, 70%, 60%)', // Pink
  'Environmental': 'hsl(180, 70%, 40%)', // Teal
  'Chemistry': 'hsl(30, 90%, 60%)', // Orange
  'Default': 'hsl(var(--primary))'
};
