export interface Meme {
  id: string;
  title: string;
  category: MemeCategory;
  imageUrl: string;
  ipfsHash: string;
  creator: string;
  creatorWallet: string;
  timestamp: number;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
}

export type MemeCategory = 'Funny' | 'Cringe' | 'Political' | 'Wholesome' | 'Dank' | 'Other';

export type SortBy = 'popularity' | 'newest' | 'oldest';

export interface CreateMemeData {
  title: string;
  category: MemeCategory;
  imageFile: File;
  creator: string;
}
