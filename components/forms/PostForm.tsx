// PostForm.tsx – Mars AI Enhanced + Mars Red Theme
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';
import { useUser } from '../../hooks/useUser';
import { useRouter } from 'next/navigation';
import PostPreview from './PostPreview';
import { Brain } from 'lucide-react';

interface PostFormProps {
  mode?: 'compact' | 'full';
  onSuccess?: () => void;
  prefill?: {
    title?: string;
    content?: string;
    categoryId?: string;
  };
}

export default function PostForm({ mode = 'full', onSuccess, prefill = {} }: PostFormProps) {
  const router = useRouter();
  const user = useUser();

  const [title, setTitle] = useState(prefill.title || '');
  const [content, setContent] = useState(prefill.content || '');
  const [externalLink, setExternalLink] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(prefill.categoryId || '');
  const [selectedCategorySymbol, setSelectedCategorySymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) console.error('Error fetching categories:', error);
      if (data) setCategories(data);
    };

    fetchCategories();
  }, []);

  const extractYouTubeID = (url: string): string | null => {
    const match = url.match(/(?:\?v=|\.be\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `buzz_media/${fileName}`;

    const { error } = await supabase.storage.from('buzzmedia').upload(filePath, imageFile);
    if (error) throw error;

    const { data: urlData } = supabase.storage.from('buzzmedia').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  const handleAskMarsAI = async () => {
    try {
      const response = await fetch('/api/marsai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: title || 'Help me write a post' }),
      });

      const data = await response.json();
      if (data?.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.error('Mars AI error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      let uploadedUrl = await handleImageUpload();

      if (!uploadedUrl && youtubeLink) {
        const youTubeId = extractYouTubeID(youtubeLink);
        if (youTubeId) {
          uploadedUrl = `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
        }
      }

      const { error: insertError } = await supabase.from('buzz_posts').insert({
        title,
        content,
        external_link: externalLink,
        youtube_link: youtubeLink,
        media_url: uploadedUrl || '',
        user_id: user?.id,
        category_id: selectedCategoryId,
        category_symbol: selectedCategorySymbol,
        is_active: true,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/feed?posted=true');
        }
      }, 300);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const youTubeId = extractYouTubeID(youtubeLink);
  const youTubeThumbnail = youTubeId ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg` : '';

  return (
    <div className="max-h-screen overflow-y-auto px-4">
      <form
        onSubmit={handleSubmit}
        className={`bg-black p-6 rounded-xl ${mode === 'compact' ? 'max-w-2xl' : 'max-w-5xl'} mx-auto space-y-6 text-white`}
      >
        {mode === 'full' && <h2 className="text-xl font-bold">📣 Create a Buzz Post</h2>}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAskMarsAI}
            className="flex items-center gap-2 px-3 py-1 mb-2 rounded bg-[#D9272E] hover:bg-red-700 text-white text-xs shadow"
          >
            <Brain size={16} /> Ask Mars AI
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />

          <input
            type="text"
            placeholder="External Link (optional)"
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            className="w-full p-2 rounded bg-neutral-800 text-white"
          />

          <textarea
            placeholder="Description / Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            className="md:col-span-2 w-full p-2 rounded bg-neutral-800 text-white"
          />

          {!imageFile && (
            <input
              type="text"
              placeholder="YouTube Link (optional)"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="w-full p-2 rounded bg-neutral-800 text-white"
            />
          )}

          <select
            value={selectedCategoryId}
            onChange={(e) => {
              const cat = categories.find((c) => c.id === e.target.value);
              setSelectedCategoryId(e.target.value);
              setSelectedCategorySymbol(cat?.symbol || '');
            }}
            required
            className="w-full p-2 rounded bg-neutral-800 text-white"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {!youtubeLink && (
            <div className="md:col-span-2 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full text-white"
              />

              {imageFile && (
                <div className="relative mt-2">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="rounded-lg max-h-48 object-cover border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="absolute top-1 right-1 bg-red-600 text-xs px-2 py-1 rounded hover:bg-red-700"
                  >
                    ✖ Remove Image
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {youTubeThumbnail && (
          <div className="mt-4">
            <img
              src={youTubeThumbnail}
              alt="YouTube Thumbnail"
              className="rounded-lg w-full max-h-64 object-cover border border-neutral-700"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !selectedCategoryId}
          className="w-full p-3 bg-[#D9272E] text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : '🚀 Submit Post'}
        </button>

        {error && <p className="text-red-400">❌ {error}</p>}
        {success && <p className="text-green-400">✅ Post submitted successfully!</p>}

        {mode === 'full' && (
          <PostPreview
            title={title}
            content={content}
            image={imageFile ? URL.createObjectURL(imageFile) : youTubeThumbnail}
            youtube={youtubeLink}
          />
        )}
      </form>
    </div>
  );
}