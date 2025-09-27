import React from 'react';
import { ClothingItem } from '../lib/supabase';
import { MapPin, Clock } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: () => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ item, onClick }) => {
  // Parse images from JSON string or handle array format
  const getImages = (): string[] => {
    if (typeof item.images === 'string') {
      try {
        return JSON.parse(item.images);
      } catch {
        return [];
      }
    }
    return Array.isArray(item.images) ? item.images : [];
  };

  const images = getImages();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className="card card-hover overflow-hidden cursor-pointer animate-fadeInUp group"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={item.title}
            className="w-full h-full object-cover image-hover group-hover:scale-110"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-xl">👕</div>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg truncate flex-1">
            {item.title}
          </h3>
          <span className="font-bold text-blue-600 text-lg ml-2">
            {formatPrice(item.price)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge badge-blue">
            {item.category}
          </span>
          <span className="badge badge-emerald">
            Size {item.size}
          </span>
          <span className="badge badge-amber">
            {item.condition}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            {item.user_profiles?.location && (
              <div className="flex items-center mr-3">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{item.user_profiles.location}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;