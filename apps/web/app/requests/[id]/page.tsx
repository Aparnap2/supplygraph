// app/requests/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api, ProcurementRequest, Quote } from '../../../lib/api';

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState<ProcurementRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRequestDetails();
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      setRequest({
        id: id as string,
        title: 'Office Equipment',
        status: 'QUOTES_REQUESTED',
        items: [
          { name: 'Office Chairs', quantity: 10, specifications: 'Ergonomic, mesh back' },
          { name: 'Standing Desks', quantity: 5, specifications: 'Adjustable height' }
        ],
        orgId: 'org1',
        createdAt: new Date().toISOString(),
      });
      
      setQuotes([
        {
          id: 'quote1',
          requestId: id as string,
          vendorId: 'vendor1',
          unitPrice: 120,
          totalPrice: 1200,
          deliveryETA: 5,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'quote2',
          requestId: id as string,
          vendorId: 'vendor2',
          unitPrice: 150,
          totalPrice: 1500,
          deliveryETA: 3,
          createdAt: new Date().toISOString(),
        }
      ]);
      setError(null);
    } catch (err) {
      console.error('Error fetching request details:', err);
      setError('Failed to fetch request details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
          <a href="/requests" className="text-blue-600 hover:underline">Back to Requests</a>
        </main>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <p className="text-zinc-600 dark:text-zinc-400">Request not found.</p>
          <a href="/requests" className="text-blue-600 hover:underline">Back to Requests</a>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {request.title}
            </h1>
            <div className="mt-2 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${request.status === 'CREATED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                  request.status === 'QUOTES_REQUESTED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                  request.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
              >
                {request.status}
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {request.status === 'CREATED' && (
              <a 
                href={`/requests/${request.id}/rfq`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium"
              >
                Send RFQ
              </a>
            )}
            {request.status === 'QUOTES_REQUESTED' && (
              <a 
                href={`/requests/${request.id}/approve`}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                Approve Quote
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Request Details
              </h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mb-3">
                  Items
                </h3>
                <div className="space-y-3">
                  {request.items.map((item, index) => (
                    <div key={index} className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                          Qty: {item.quantity} | {item.specifications}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Request Info
              </h2>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Request ID</div>
                  <div className="text-zinc-900 dark:text-zinc-50 font-mono text-sm">{request.id}</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Created</div>
                  <div className="text-zinc-900 dark:text-zinc-50">
                    {new Date(request.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Status</div>
                  <div className="text-zinc-900 dark:text-zinc-50">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'CREATED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                        request.status === 'QUOTES_REQUESTED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {quotes.length > 0 && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6 mt-8">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Received Quotes ({quotes.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Delivery ETA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        Vendor {quote.vendorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                        ${quote.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                        ${quote.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                        {quote.deliveryETA} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}