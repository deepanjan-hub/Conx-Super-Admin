import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ClientsTable } from "@/components/dashboard/ClientsTable";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ChannelMetrics } from "@/components/dashboard/ChannelMetrics";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Users, DollarSign, MessageSquare, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Super Admin">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Clients"
            value="156"
            change="+12 this month"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
          />
          <StatsCard
            title="Monthly Revenue"
            value="$112,450"
            change="+18.2% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Conversations"
            value="1.24M"
            change="+8.1% this week"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-primary"
          />
          <StatsCard
            title="Avg. Resolution Rate"
            value="94.2%"
            change="-0.3% from baseline"
            changeType="negative"
            icon={TrendingUp}
            iconColor="text-warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <ChannelMetrics />
        </div>

        {/* Clients Table */}
        <ClientsTable />

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SystemHealth />
          <ActivityFeed />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;