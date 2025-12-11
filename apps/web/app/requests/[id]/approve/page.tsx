// app/requests/[id]/approve/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ProcurementRequest, Quote } from '../../../../lib/api';

export default function ApproveQuotesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ProcurementRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Using mock data for now
      setRequest({
        id: id as string,
        title: 'Office Equipment',
        status: 'QUOTES_RECEIVED',
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
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedQuote) {
      setError('Please select a quote to approve');
      return;
    }

    setIsApproving(true);
    setError(null);

    try {
      // In a real implementation, this would be:
      // await api.approveRequest(id as string, selectedQuote);
      console.log('Approving quote:', selectedQuote);
      
      alert(`Quote approved successfully! Payment will be processed. (Mock)`);
      router.push(`/requests/${id}`);
    } catch (err) {
      console.error('Error approving quote:', err);
      setError('Failed to approve quote. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-6"></div>
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

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
          <a href={`/requests/${id}`} className="text-blue-600 hover:underline">Back to Request</a>
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
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Approve Quote for: {request.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Compare quotes and select the best option
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Request Items
              </h2>
              <div className="space-y-3">
                {request.items.map((item, index) => (
                  <div key={index} className="flex justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      {item.specifications}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Available Quotes
              </h2>

              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-300">
                  {error}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Select
                      </th>
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {quotes.map((quote) => (
                      <tr 
                        key={quote.id} 
                        className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
                          selectedQuote === quote.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => setSelectedQuote(quote.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="radio"
                            name="selectedQuote"
                            checked={selectedQuote === quote.id}
                            onChange={() => {}}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300"
                          />
                        </td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                Approval Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Request</div>
                  <div className="text-zinc-900 dark:text-zinc-50 font-medium">{request.title}</div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Selected Quote</div>
                  <div className="text-zinc-900 dark:text-zinc-50">
                    {selectedQuote 
                      ? `${quotes.find(q => q.id === selectedQuote)?.totalPrice.toFixed(2)} (${quotes.find(q => q.id === selectedQuote)?.deliveryETA} days)` 
                      : 'None selected'}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">Status</div>
                  <div className="text-zinc-900 dark:text-zinc-50">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleApprove}
                disabled={isApproving || !selectedQuote}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isApproving ? 'Processing...' : 'Approve & Process Payment'}
              </button>
              
              <a
                href={`/requests/${id}`}
                className="block w-full text-center mt-3 px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}