import { Link } from 'react-router-dom';

interface BlogPostPreviewProps {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
  featured?: boolean;
}

export default function BlogPostPreview({ title, excerpt, category, date, imageUrl, slug }: BlogPostPreviewProps) {
  return (
    <Link to={`/blog/${slug}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <span className="text-sm text-primary-600">{category}</span>
          <h3 className="text-xl font-semibold mt-2 mb-3">{title}</h3>
          <p className="text-gray-600 line-clamp-2">{excerpt}</p>
          <div className="text-sm text-gray-500 mt-4">
            {new Date(date).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
} 