export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Procurement Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your procurement requests, vendors, and quotes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              New Request
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Create a new procurement request
            </p>
            <a
              href="/requests/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Create Request
            </a>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Send RFQ
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Send requests for quotes to vendors
            </p>
            <a
              href="/requests"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Manage Requests
            </a>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
              Vendors
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Manage your vendor list
            </p>
            <a
              href="/vendors"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Manage Vendors
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Recent Procurement Requests
            </h2>
          </div>
          <div className="p-6">
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
              No requests yet. <a href="/requests/new" className="text-blue-600 hover:underline">Create your first request</a> to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
