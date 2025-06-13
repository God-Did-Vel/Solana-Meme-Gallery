
import "./App.css";

import { useState, useEffect } from 'react';
import { AppWalletProvider } from './components/WalletProvider';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { MemeCard } from './components/MemeCard';
import { UploadModal } from './components/UploadModal';
import { useWallet } from './hooks/useWallet';
import { SolanaService } from './services/solana';
import { IPFSService } from './services/ipfs';
import type { Meme, MemeCategory, SortBy, CreateMemeData } from './types/meme';
import { Loader2 } from 'lucide-react';


function MemeGallery() {
  const { connected, address } = useWallet();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [filteredMemes, setFilteredMemes] = useState<Meme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MemeCategory | 'All'>('All');
  const [selectedSort, setSelectedSort] = useState<SortBy>('popularity');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [votingMemes, setVotingMemes] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMemes();
  }, []);

  useEffect(() => {
    filterAndSortMemes();
  }, [memes, selectedCategory, selectedSort]);

  const loadMemes = async () => {
    try {
      setIsLoading(true);
      const memesData = await SolanaService.getMemes();
      setMemes(memesData);
    } catch (error) {
      console.error('Failed to load memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortMemes = () => {
    let filtered = memes;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(meme => meme.category === selectedCategory);
    }

    // Sort memes
    filtered = [...filtered].sort((a, b) => {
      switch (selectedSort) {
        case 'popularity':
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        default:
          return 0;
      }
    });

    setFilteredMemes(filtered);
  };

  const handleUploadMeme = async (data: CreateMemeData) => {
    if (!connected) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image to IPFS
      const ipfsHash = await IPFSService.uploadImage(data.imageFile);
      
      // Create meme on Solana
      const newMeme = await SolanaService.createMeme(data, address, ipfsHash);
      
      // Add to local state
      setMemes(prev => [newMeme, ...prev]);
      setIsUploadModalOpen(false);
    } catch (error) {
      console.error('Failed to upload meme:', error);
      alert('Failed to upload meme. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVote = async (memeId: string, voteType: 'up' | 'down') => {
    if (!connected) {
      alert('Please connect your wallet to vote!');
      return;
    }

    if (votingMemes.has(memeId)) return;

    try {
      setVotingMemes(prev => new Set(prev).add(memeId));
      
      // Submit vote to Solana
      await SolanaService.voteMeme(memeId, voteType, address);
      
      // Update local state
      setMemes(prev => prev.map(meme => {
        if (meme.id === memeId) {
          const updatedMeme = { ...meme };
          
          // Remove previous vote if exists
          if (meme.userVote === 'up') updatedMeme.upvotes--;
          if (meme.userVote === 'down') updatedMeme.downvotes--;
          
          // Add new vote
          if (voteType === 'up') updatedMeme.upvotes++;
          if (voteType === 'down') updatedMeme.downvotes++;
          
          updatedMeme.userVote = voteType;
          return updatedMeme;
        }
        return meme;
      }));
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVotingMemes(prev => {
        const newSet = new Set(prev);
        newSet.delete(memeId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <FilterBar
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading memes...</span>
          </div>
        ) : filteredMemes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {selectedCategory === 'All' 
                ? 'No memes found. Be the first to upload one!' 
                : `No ${selectedCategory.toLowerCase()} memes found.`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMemes.map((meme) => (
              <MemeCard
                key={meme.id}
                meme={meme}
                onVote={handleVote}
                isVoting={votingMemes.has(meme.id)}
              />
            ))}
          </div>
        )}
      </main>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadMeme}
        isUploading={isUploading}
      />
    </div>
  );
}

function App() {
  return (
    <AppWalletProvider>
      <MemeGallery />
    </AppWalletProvider>
  );
}

export default App;
