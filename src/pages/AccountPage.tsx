import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, ClothingItem } from '../lib/supabase';
import ClothingCard from '../components/ClothingCard';
import { Link } from 'react-router-dom';

const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    activeItems: 0,
  });

  const fetchUserItems = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select(`
          *,
          user_profiles (
            full_name,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const items = data || [];
      setUserItems(items);
      setStats({
        totalItems: items.length,
        totalValue: items.reduce((sum, item) => sum + item.price, 0),
        activeItems: items.length,
      });
    } catch (error) {
      console.error('Error fetching user items:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserItems();
    }
  }, [user, fetchUserItems]);

  // moved above and memoized with useCallback

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const { error } = await supabase
        .from('clothing_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      
      setUserItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-24"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <Link
            to="/create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Item
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-full">
                <div className="h-6 w-6 text-emerald-600 font-bold">$</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full">
                <div className="h-6 w-6 bg-amber-600 rounded-full"></div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeItems}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Items</h2>
        {userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userItems.map((item) => (
              <div key={item.id} className="relative group">
                <ClothingCard item={item} />
                
                {/* Action Overlay */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* TODO: Navigate to edit */}}
                      className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                      title="Edit item"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-white shadow-lg rounded-full p-2 hover:bg-red-50 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-600 mb-4">Start selling by creating your first item listing</p>
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;