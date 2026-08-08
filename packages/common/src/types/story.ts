export type AspectRatio = '16:9' | '9:16' | '4:3' | '1:1';

export type SeriesGenre = 
  | 'all'
  | 'sci-fi'
  | 'horror'
  | 'cyberpunk'
  | 'thriller'
  | 'space'
  | 'mystery'
  | 'fantasy'
  | 'reality-show'
  | 'anime'
  | 'comedy'
  | 'drama';

export type SortOption = 'trending' | 'newest' | 'most_branched' | 'top_rated';

export interface Series {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  backdropImage: string;
  previewVideoUrl?: string;
  genre: SeriesGenre;
  tags: string[];
  totalEpisodes: number;
  totalPaths: number;
  viewCount: number;
  rating: number; // 0 to 5
  rootEpisodeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeChoice {
  id: string;
  targetEpisodeId: string;
  label: string; // e.g. "Option A"
  text: string;  // e.g. "Infiltrate the server room through the vents"
  description?: string;
  previewThumbnailUrl?: string;
  pickCount: number;
  pickPercentage: number; // 0 to 100
}

export interface Episode {
  id: string;
  seriesId: string;
  parentEpisodeId: string | null;
  choicePromptLeadingHere?: string | null;
  episodeNumber: number; // Tree depth (1 = root)
  title: string;
  synopsis: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  aspectRatio: AspectRatio;
  viewCount: number;
  isLeaf: boolean;
  choices: EpisodeChoice[];
  createdAt: string;
}

export interface Comment {
  id: string;
  episodeId: string;
  sessionId: string;
  authorName: string;
  text: string;
  upvotes: number;
  downvotes: number;
  score: number; // upvotes - downvotes
  isPicked: boolean; // Flagged if this idea became canon
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

export interface CommentVote {
  commentId: string;
  sessionId: string;
  voteType: 'up' | 'down';
  createdAt: string;
}

export interface UserJourney {
  id: string;
  sessionId: string;
  seriesId: string;
  pathEpisodeIds: string[];
  currentEpisodeId: string;
  updatedAt: string;
}

export interface StoryGraphNode {
  id: string;
  title: string;
  episodeNumber: number;
  choiceTextLeadingHere?: string;
  isLeaf: boolean;
  isCurrent?: boolean;
  isVisited?: boolean;
  viewCount: number;
}

export interface StoryGraphEdge {
  fromEpisodeId: string;
  toEpisodeId: string;
  choiceText: string;
  pickPercentage: number;
  isTraversed?: boolean;
}

export interface StoryGraph {
  seriesId: string;
  rootEpisodeId: string;
  nodes: StoryGraphNode[];
  edges: StoryGraphEdge[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
