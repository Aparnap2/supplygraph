// app/requests/[id]/rfq/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, ProcurementRequest, Vendor } from '../../../../lib/api';

export default function SendRFQPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ProcurementRequest | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
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
        status: 'CREATED',
        items: [
          { name: 'Office Chairs', quantity: 10, specifications: 'Ergonomic, mesh back' },
          { name: 'Standing Desks', quantity: 5, specifications: 'Adjustable height' }
        ],
        orgId: 'org1',
        createdAt: new Date().toISOString(),
      });
      
      setVendors([
        {
          id: '1',
          name: 'Office Supplies Co',
          email: 'sales@officesupplies.com',
          orgId: 'org1'
        },
        {
          id: '2',
          name: 'Tech Equipment Ltd',
          email: 'quotes@techequip.com',
          orgId: 'org1'
        },
        {
          id: '3',
          name: 'Furniture Plus',
          email: 'orders@furnitureplus.com',
          orgId: 'org1'
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

  const handleVendorSelection = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId) 
        : [...prev, vendorId]
    );
  };

  const handleSendRFQ = async () => {
    if (selectedVendors.length === 0) {
      setError('Please select at least one vendor');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      // In a real implementation, this would be:
      // await api.sendRFQs(id as string, { vendors: selectedVendors });
      console.log('Sending RFQ to vendors:', selectedVendors);
      
      alert(`RFQ sent to ${selectedVendors.length} vendor(s) successfully! (Mock)`);
      router.push(`/requests/${id}`);
    } catch (err) {
      console.error('Error sending RFQ:', err);
      setError('Failed to send RFQ. Please try again.');
    } finally {
      setIsSending(false);
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Send RFQ for: {request.title}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Select vendors to send your request for quotes
          </p>
        </div>

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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Select Vendors
            </h2>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {selectedVendors.length} selected
            </span>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div 
                key={vendor.id} 
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedVendors.includes(vendor.id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                }`}
                onClick={() => handleVendorSelection(vendor.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedVendors.includes(vendor.id)}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-zinc-900 dark:text-zinc-50">
                    {vendor.name}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {vendor.email}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <a 
              href={`/requests/${id}`}
              className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </a>
            <button
              onClick={handleSendRFQ}
              disabled={isSending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium disabled:opacity-50"
            >
              {isSending ? 'Sending...' : `Send RFQ to ${selectedVendors.length} Vendor(s)`}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}