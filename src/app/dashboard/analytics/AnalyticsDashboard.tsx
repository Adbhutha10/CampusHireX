"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsDashboard({ stats, branchData }: { stats: any, branchData: any[] }) {
  const pieData = [
    { name: 'Placed', value: stats.totalPlaced },
    { name: 'Unplaced', value: Math.max(0, stats.totalStudents - stats.totalPlaced) }
  ];

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
         <MetricCard title="Placement Rate" value={stats.totalStudents > 0 ? Math.round((stats.totalPlaced / stats.totalStudents) * 100) + "%" : "0%"} />
         <MetricCard title="Total Offers" value={stats.totalPlaced.toString()} />
         <MetricCard title="Visiting Companies" value={stats.totalCompanies.toString()} />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="card p-8 min-h-[450px] shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-8">Branch-wise Performance</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="total" name="Students" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-8 min-h-[450px] shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-8">Overall Success Rate</h3>
          <div className="flex-1 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#E2E8F0" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string, value: string }) {
  return (
    <div className="card p-8 flex flex-col items-center justify-center text-center space-y-2 border-b-4 border-b-primary shadow-sm hover:-translate-y-1 transition-transform">
      <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <p className="text-4xl font-black text-foreground">{value}</p>
    </div>
  )
}
