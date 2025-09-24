import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice, totalCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty. Start adding items from Browse.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <button onClick={clearCart} className="btn-secondary">Clear cart</button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-center">
              <img
                src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'}
                alt={item.title}
                className="w-20 h-20 object-cover rounded mr-4"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-blue-600 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="btn-secondary px-3 py-2"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  className="btn-secondary px-3 py-2"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  className="ml-4 btn-secondary px-3 py-2"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-4 flex items-center justify-between">
        <div className="text-gray-700">Items: <span className="font-semibold">{totalCount}</span></div>
        <div className="text-xl font-bold text-gray-900">Total: ${totalPrice.toFixed(2)}</div>
        <button className="btn-primary">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;


