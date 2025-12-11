// app/requests/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { api, ProcurementRequest } from '../../lib/api';

export default function RequestsPage() {
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the backend may need proper auth setup
      // const data = await api.getRequests();
      // setRequests(data);
      setRequests([
        {
          id: '1',
          title: 'Office Equipment',
          status: 'CREATED',
          items: [
            { name: 'Office Chairs', quantity: 10, specifications: 'Ergonomic, mesh back' },
            { name: 'Standing Desks', quantity: 5, specifications: 'Adjustable height' }
          ],
          orgId: 'org1',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'IT Hardware',
          status: 'QUOTES_REQUESTED',
          items: [
            { name: 'Laptops', quantity: 20, specifications: '16GB RAM, 512GB SSD' }
          ],
          orgId: 'org1',
          createdAt: new Date().toISOString(),
        }
      ]);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to fetch requests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Procurement Requests
          </h1>
          <a 
            href="/requests/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Create Request
          </a>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {request.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'CREATED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                        request.status === 'QUOTES_REQUESTED' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <a 
                      href={`/requests/${request.id}`} 
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                    >
                      View
                    </a>
                    <a 
                      href={`/requests/${request.id}/rfq`} 
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      Send RFQ
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {requests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-600 dark:text-zinc-400">
                No procurement requests found. <a href="/requests/new" className="text-blue-600 hover:underline">Create your first request</a>.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}