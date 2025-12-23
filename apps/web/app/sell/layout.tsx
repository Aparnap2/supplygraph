import Link from 'next/link';
import { BarChart3, FileText, Users, Settings } from 'lucide-react';

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">DealGraph</h1>
              <p className="text-sm text-gray-500">Sales Mode</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {/* TODO: Add user profile/auth info */}
            Demo Organization
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/sell"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/sell" // TODO: Add dedicated proposals page
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FileText className="h-5 w-5" />
              <span>Proposals</span>
            </Link>
            <Link
              href="/sell" // TODO: Add clients page
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Users className="h-5 w-5" />
              <span>Clients</span>
            </Link>
            <Link
              href="/sell" // TODO: Add settings page
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
