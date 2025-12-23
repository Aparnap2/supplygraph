// app/sell/page.tsx - Sales Dashboard
import Link from 'next/link';
import { Plus, TrendingUp, Target, Clock } from 'lucide-react';

// TODO: Import from our shared API client
// import { api } from '@/src/shared';

interface Proposal {
  id: string;
  title: string;
  clientName: string;
  status: string;
  value: number;
  createdAt: string;
}

// Mock data for now - replace with API call
const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Enterprise Software RFP',
    clientName: 'TechCorp Inc.',
    status: 'DRAFT',
    value: 150000,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Cloud Migration Project',
    clientName: 'Global Solutions Ltd.',
    status: 'SENT',
    value: 75000,
    createdAt: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Data Analytics Platform',
    clientName: 'StartupXYZ',
    status: 'WON',
    value: 95000,
    createdAt: '2024-01-05T09:15:00Z',
  },
];

function SummaryCard({
  title,
  value,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-sm text-green-600">{trend}</p>}
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  );
}

function ProposalsTable({ proposals }: { proposals: Proposal[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'WON':
        return 'bg-green-100 text-green-800';
      case 'LOST':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Proposals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {proposal.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {proposal.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${proposal.value.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(proposal.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default async function SellDashboard() {
  // TODO: Fetch real data from API
  // const proposals = await api.getProposals();
  const proposals = mockProposals;

  // Calculate summary stats
  const totalRevenue = proposals
    .filter(p => p.status === 'WON')
    .reduce((sum, p) => sum + p.value, 0);

  const winRate = proposals.length > 0
    ? Math.round((proposals.filter(p => p.status === 'WON').length / proposals.length) * 100)
    : 0;

  const activeProposals = proposals.filter(p => ['DRAFT', 'SENT'].includes(p.status)).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend="+12% from last month"
        />
        <SummaryCard
          title="Win Rate"
          value={`${winRate}%`}
          icon={Target}
          trend="+5% from last month"
        />
        <SummaryCard
          title="Active Proposals"
          value={activeProposals.toString()}
          icon={Clock}
        />
      </div>

      {/* Proposals Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Proposals</h2>
          <Link
            href="/sell/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Link>
        </div>
        <ProposalsTable proposals={proposals} />
      </div>
    </div>
  );
}
