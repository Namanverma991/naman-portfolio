import React, { useState } from 'react';
import useSWR from 'swr';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import { Line, Doughnut } from 'react-chartjs-2';
import { FaUsers, FaDownload, FaEye, FaNetworkWired } from 'react-icons/fa';
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

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('visitors');

  const { data: visitorData } = useSWR('/api/analytics/visitors?period=month');
  const { data: resumeData } = useSWR('/api/analytics/resume');
  const { data: projectsData } = useSWR('/api/analytics/projects');
  const { data: sectionsData } = useSWR('/api/analytics/sections');

  const tabs = [
    { id: 'visitors', label: 'Visitors' },
    { id: 'resume', label: 'Resume Downloads' },
    { id: 'projects', label: 'Project Insights' },
    { id: 'sections', label: 'Page Sections' },
  ];

  const visitorLineData = {
    labels: visitorData?.dailyData?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Daily Visitors',
        data: visitorData?.dailyData?.map(d => d.count) || [],
        borderColor: '#f13024',
        backgroundColor: 'rgba(241, 48, 36, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const deviceDonutData = {
    labels: visitorData?.deviceData?.map(d => d.device) || ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: visitorData?.deviceData?.map(d => d.count) || [70, 25, 5],
        backgroundColor: ['#f13024', '#3b82f6', '#10b981'],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#71717a' } },
      y: { grid: { color: 'rgba(63, 63, 70, 0.2)' }, ticks: { color: '#71717a' } },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#d4d4d8' } } },
  };

  return (
    <div className="space-y-6">
      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-semibold tracking-wide border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-zinc-550 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visitors Tab */}
      {activeTab === 'visitors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Visitors" value={visitorData?.totalVisitors || 0} icon={FaUsers} description="All-time views" />
            <StatCard title="Unique Visitors" value={visitorData?.uniqueVisitors || 0} icon={FaEye} description="Unique clients" />
            <StatCard title="Top Referrer" value={visitorData?.referrers?.[0]?.referrer || 'Direct'} icon={FaNetworkWired} description="Primary source" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="Daily Traffic (Last 30 Days)" className="lg:col-span-2">
              <Line data={visitorLineData} options={lineOptions} />
            </ChartCard>
            <ChartCard title="Device Breakdown">
              <Doughnut data={deviceDonutData} options={donutOptions} />
            </ChartCard>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Referring Traffic Sources</h3>
            <DataTable
              columns={[
                { key: 'referrer', label: 'Referrer URL', render: (val) => val || 'Direct/Bookmark' },
                { key: 'count', label: 'Sessions' },
              ]}
              data={visitorData?.referrers || []}
            />
          </div>
        </div>
      )}

      {/* Resume Tab */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard title="Total Downloads" value={resumeData?.totalDownloads || 0} icon={FaDownload} description="PDF downloads" />
            <StatCard title="Resume Views" value={resumeData?.totalViews || 0} icon={FaEye} description="Total interactions" />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Download History</h3>
            <DataTable
              columns={[
                { key: 'timestamp', label: 'Date & Time', render: (val) => val ? new Date(val).toLocaleString() : '' },
                { key: 'device', label: 'Device' },
                { key: 'browser', label: 'Browser' },
                { key: 'os', label: 'OS' },
                { key: 'ip_hash', label: 'IP Hash' },
              ]}
              data={resumeData?.history || []}
            />
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Projects Performance</h3>
            <DataTable
              columns={[
                { key: 'project_title', label: 'Project Name' },
                { key: 'views', label: 'Views', render: (val) => val || 0 },
                { key: 'clicks', label: 'Total Clicks', render: (val) => val || 0 },
                { key: 'github_clicks', label: 'GitHub Clicks', render: (val) => val || 0 },
                { key: 'demo_clicks', label: 'Live Demo Clicks', render: (val) => val || 0 },
              ]}
              data={projectsData || []}
            />
          </div>
        </div>
      )}

      {/* Page Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Page Section Views</h3>
            <DataTable
              columns={[
                { key: 'page', label: 'Route Path', render: (val) => val || '/' },
                { key: 'count', label: 'Page Views' },
              ]}
              data={sectionsData || []}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
