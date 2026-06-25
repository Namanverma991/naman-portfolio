import React from 'react';
import useSWR from 'swr';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import { FaUsers, FaDownload, FaEnvelope, FaEye, FaPlus, FaUserEdit, FaFilePdf, FaInbox } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const DashboardOverview = () => {
  // Fetch stats and contact lists
  const { data: stats } = useSWR('/api/analytics/visitors?period=month');
  const { data: resumeStats } = useSWR('/api/analytics/resume');
  const { data: messages } = useSWR('/api/contact/list?limit=5');

  const visitorCount = stats?.totalVisitors || 0;
  const uniqueCount = stats?.uniqueVisitors || 0;
  const downloadCount = resumeStats?.totalDownloads || 0;
  const messageCount = messages?.total || 0;

  // Setup visitor line chart details
  const visitorChartData = {
    labels: stats?.dailyData?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Daily Visitors',
        data: stats?.dailyData?.map(d => d.count) || [],
        borderColor: '#f13024',
        backgroundColor: 'rgba(241, 48, 36, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Setup devices donut chart details
  const deviceChartData = {
    labels: stats?.deviceData?.map(d => d.device) || ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: stats?.deviceData?.map(d => d.count) || [70, 25, 5],
        backgroundColor: ['#f13024', '#3b82f6', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a' } },
      y: { grid: { color: 'rgba(63, 63, 70, 0.2)' }, ticks: { color: '#71717a' } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#d4d4d8' } },
    },
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { key: 'created_at', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/admin/projects" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/20">
          <FaPlus /> Add Project
        </Link>
        <Link href="/admin/profile" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 active:scale-95 transition-all">
          <FaUserEdit /> Edit Profile
        </Link>
        <Link href="/admin/resume" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 active:scale-95 transition-all">
          <FaFilePdf /> Upload Resume
        </Link>
        <Link href="/admin/messages" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold text-xs uppercase tracking-wider hover:text-white hover:bg-zinc-800 active:scale-95 transition-all">
          <FaInbox /> Messages Inbox
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Visitors" value={visitorCount} icon={FaUsers} description="All-time visits" trend="+15%" trendType="up" />
        <StatCard title="Unique Visitors" value={uniqueCount} icon={FaEye} description="Unique users" trend="+8%" trendType="up" />
        <StatCard title="Resume Downloads" value={downloadCount} icon={FaDownload} description="Total PDF downloads" trendType="neutral" />
        <StatCard title="Total Messages" value={messageCount} icon={FaEnvelope} description="Contact inquiries" trendType="neutral" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Visitor Statistics (Last 30 Days)" className="lg:col-span-2">
          <Line data={visitorChartData} options={lineOptions} />
        </ChartCard>
        <ChartCard title="Devices Used">
          <Doughnut data={deviceChartData} options={donutOptions} />
        </ChartCard>
      </div>

      {/* Recent Contact Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold text-zinc-350 uppercase tracking-wider">Recent Contact Inquiries</h2>
          <Link href="/admin/messages" className="text-xs font-semibold text-accent hover:underline">
            View All Messages &rarr;
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={messages?.items || []}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
