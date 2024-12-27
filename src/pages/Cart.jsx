import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

const Cart = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);

  useEffect(() => {
    const items = localStorage.getItem('savedItems');
    if (items) {
      setSavedItems(JSON.parse(items));
    }
  }, []);

  const removeItem = (itemId) => {
    const newItems = savedItems.filter(item => item.id !== itemId);
    setSavedItems(newItems);
    localStorage.setItem('savedItems', JSON.stringify(newItems));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        onClick={() => navigate('/')}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back
      </button>

      <h2 className="text-xl font-semibold mb-4">Saved Items</h2>

      {savedItems.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No saved items yet</p>
      ) : (
        <div className="grid gap-4">
          {savedItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.store}</p>
                <p className="text-lg font-bold text-blue-600">{item.price}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="self-center text-red-500"
              >
                <TrashIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;