"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Code, Users, DollarSign, TrendingUp, ArrowUp } from "lucide-react";

interface DashboardStats {
  totalHackathons: number;
  totalProjects: number;
  totalVotes: number;
  totalPayments: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsData = [
    {
      title: "Total Hackathons",
      value: stats.totalHackathons,
      icon: Trophy,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10 border-blue-500/20",
      borderColor: "border-blue-500/30",
      description: "Active and completed events",
      trend: "+12%",
    },
    {
      title: "Submitted Projects",
      value: stats.totalProjects,
      icon: Code,
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
      borderColor: "border-green-500/30",
      description: "Decentralized applications",
      trend: "+8%",
    },
    {
      title: "Community Votes",
      value: stats.totalVotes,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10 border-purple-500/20",
      borderColor: "border-purple-500/30",
      description: "Quorum-based decisions",
      trend: "+24%",
    },
    {
      title: "Split Payments",
      value: stats.totalPayments,
      icon: DollarSign,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10 border-orange-500/20",
      borderColor: "border-orange-500/30",
      description: "Contributors vs maintainers",
      trend: "+5%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className={`border ${stat.borderColor} bg-[#111111] hover:border-opacity-60 transition-all duration-200`}>
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 lg:p-3 rounded-lg ${stat.bgColor} border border-[#2a2a2a]`}>
                <stat.icon className={`w-4 h-4 lg:w-6 lg:h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-green-400 text-xs lg:text-sm">
                <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>{stat.trend}</span>
              </div>
            </div>
            <div>
              <p className="text-xs lg:text-sm font-medium text-neutral-400 mb-1 lg:mb-2">
                {stat.title}
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 mt-1 lg:mt-2">
                {stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
