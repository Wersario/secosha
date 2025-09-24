import React, { useEffect } from 'react';
import { X, MapPin, Clock, ShoppingCart } from 'lucide-react';
import { ClothingItem } from '../lib/supabase';
import { useCart } from '../contexts/CartContext';

interface ItemModalProps {
  item: ClothingItem | null;
  onClose: () => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, onClose }) => {
  const { addItem } = useCart();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-white shadow hover:bg-gray-50 focus-ring"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-100">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-900 mr-3">{item.title}</h2>
              <span className="text-2xl font-extrabold text-blue-600">{formatPrice(item.price)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-blue">{item.category}</span>
              <span className="badge badge-emerald">Size {item.size}</span>
              <span className="badge badge-amber">{item.condition}</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>Posted {formatDate(item.created_at)}</span>
              </div>
              {item.user_profiles?.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{item.user_profiles.location}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="btn-primary flex items-center"
                onClick={() => {
                  if (item) {
                    addItem({ id: item.id, title: item.title, price: item.price, image: item.images?.[0] });
                  }
                }}
              >
                <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
              </button>
              <button className="btn-secondary" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;


