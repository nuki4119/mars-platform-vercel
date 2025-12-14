'use client';

interface PostPreviewProps {
  title: string;
  content: string;
  image: string;
  youtube: string;
}

export default function PostPreview({
  title,
  content,
  image,
  youtube,
}: PostPreviewProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-xl shadow-md text-white space-y-3 mt-8">
      <h2 className="text-xl font-bold">{title || 'Post Title'}</h2>

      {image && (
        <img
          src={image}
          alt="Preview"
          className="rounded w-full max-h-64 object-cover"
        />
      )}

      {youtube && (
        <iframe
          className="w-full h-64 rounded"
          src={`https://www.youtube.com/embed/${youtube.split('v=')[1]}`}
          frameBorder="0"
          allowFullScreen
        />
      )}

      <p>{content || 'Your post content will appear here.'}</p>
    </div>
  );
}

