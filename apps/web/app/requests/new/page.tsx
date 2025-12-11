// app/requests/new/page.tsx
"use client";

import { useState } from 'react';
import { api, CreateRequestPayload } from '../../../lib/api';

export default function NewRequestPage() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState<Array<{
    name: string;
    quantity: number;
    specifications: string;
  }>>([
    { name: '', quantity: 1, specifications: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, specifications: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Mock creation since backend may need auth setup
      console.log('Creating request:', {
        title,
        items,
        orgId: 'org1', // This would come from auth context in real implementation
        created_by: 'user1' // This would come from auth context in real implementation
      });
      
      alert('Request created successfully! (Mock)');
      // In real implementation, this would be:
      // const response = await api.createRequest({
      //   title,
      //   items,
      //   orgId: 'org1', // from auth context
      //   created_by: 'user1' // from auth context
      // });
      // router.push(`/requests/${response.id}`);

      // Reset form
      setTitle('');
      setItems([{ name: '', quantity: 1, specifications: '' }]);
    } catch (error) {
      console.error('Error creating request:', error);
      setSubmitError('Failed to create request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          Create New Procurement Request
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
          {submitError && (
            <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg dark:bg-red-900/20 dark:text-red-300">
              {submitError}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Request Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              placeholder="e.g., Office Equipment Purchase"
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + Add Item
              </button>
            </div>

            {items.map((item, index) => (
              <div key={index} className="mb-4 p-4 border border-zinc-200 rounded-md dark:border-zinc-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                      placeholder="e.g., Office Chairs"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Specifications
                    </label>
                    <input
                      type="text"
                      value={item.specifications}
                      onChange={(e) => updateItem(index, 'specifications', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                      placeholder="e.g., Ergonomic, mesh back"
                    />
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <a 
              href="/requests"
              className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}