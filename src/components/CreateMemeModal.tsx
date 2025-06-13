import { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import type { CreateMemeData } from '../types/meme';
import type { MemeCategory } from '../types/meme';
import { cn } from '../utils/utils';

interface CreateMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMemeData) => Promise<void>;
  loading: boolean;
}

const categories: MemeCategory[] = ['Funny', 'Cringe', 'Political', 'Wholesome', 'Dank'];

export const CreateMemeModal = ({ isOpen, onClose, onSubmit, loading }: CreateMemeModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<typeof categories[number]>('Funny');
  const [creator, setCreator] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !creator || !imageFile) return;

    await onSubmit({
      title,
      category,
      creator,
      imageFile,
    });

    // Reset form
    setTitle('');
    setCreator('');
    setImageFile(null);
    setImagePreview('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Create New Meme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meme Image
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center h-32">
                  <ImageIcon size={32} className="text-gray-400 mb-2" />
                  <span className="text-gray-400">Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Enter meme title..."
              required
            />
          </div>

          {/* Creator */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Creator Name
            </label>
            <input
              type="text"
              value={creator}
              onChange={(e) => setCreator(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Your name..."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof categories[number])}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!title || !creator || !imageFile || loading}
            className={cn(
              "w-full py-2 px-4 rounded-lg font-medium transition-colors",
              loading || !title || !creator || !imageFile
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Meme...
              </div>
            ) : (
              'Create Meme'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
