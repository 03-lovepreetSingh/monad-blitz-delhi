"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/assets/components/sidebar";
import Topbar from "@/assets/components/topbar";
import { useSidebarContext } from "@/assets/components/SidebarContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, Clock, Code, Users, Trophy, Plus, Filter, Search } from "lucide-react";
import Link from "next/link";
import { getAllHackathons, getHacksDashboardStats } from "@/actions/hacks";
import { CreateHackathonDialog } from "./components/CreateHackathonDialog";
import { HackathonCard } from "./components/HackathonCard";
import { StatsCards } from "./components/StatsCards";
import { FeaturedHackathon } from "@/components/hackathons/FeaturedHackathon";
import { HackathonFilters } from "@/components/hackathons/HackathonFilters";

interface Hackathon {
  id: string;
  name: string;
  description: string | null;
  start_date: Date;
  end_date: Date;
  image_url: string | null;
  status: string | null;
  created_at: Date | null;
  created_by: string | null;
}

interface DashboardStats {
  totalHackathons: number;
  totalProjects: number;
  totalVotes: number;
  totalPayments: number;
}

export default function HacksPageClient() {
  const { data: session } = useSession();
  const { isShrunk } = useSidebarContext();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hackathonsResult, statsResult] = await Promise.all([
        getAllHackathons(),
        getHacksDashboardStats()
      ]);

      if (hackathonsResult.success) {
        setHackathons(hackathonsResult.hackathons || []);
      }

      if (statsResult.success) {
        setStats(statsResult.stats || null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (hackathon.description && hackathon.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || hackathon.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Only show sidebar on larger screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isShrunk ? "lg:ml-16" : "lg:ml-64"}`}>
        <Topbar />
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="text-center lg:text-left">
                <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-white break-words px-2">
                  Explore Hackathons
                </h1>
                <p className="text-gray-400 mt-2 text-xs sm:text-sm lg:text-base leading-relaxed px-2">
                  Welcome to your hackathon dashboard! Manage projects, invite teammates, and track your hackathon journey with ease — all in one place.
                </p>
              </div>
              <div className="px-2 lg:px-0">
                <CreateHackathonDialog
                  trigger={
                    <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
                      <Plus className="w-4 h-4 mr-2" />
                      Host a Hackathon
                    </Button>
                  }
                  onSuccess={fetchData}
                />
              </div>
            </div>

            {/* Stats Cards */}
            {stats && <StatsCards stats={stats} />}

            {/* Featured Hackathon */}
            <div className="mb-4 sm:mb-6 lg:mb-8 px-2">
              <FeaturedHackathon />
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:gap-4 bg-[#1a1a1a] p-3 sm:p-4 rounded-lg border border-[#2a2a2a] mx-2">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search hackathons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-9 sm:h-10 text-xs sm:text-sm bg-[#111111] border-[#2a2a2a] text-white placeholder-gray-500 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 md:w-48 h-9 sm:h-10 bg-[#111111] border-[#2a2a2a] text-white focus:border-blue-500 text-xs sm:text-sm">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                    <SelectItem value="all" className="text-white hover:bg-[#2a2a2a] text-xs sm:text-sm">All Status</SelectItem>
                    <SelectItem value="upcoming" className="text-white hover:bg-[#2a2a2a] text-xs sm:text-sm">Upcoming</SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-[#2a2a2a] text-xs sm:text-sm">Active</SelectItem>
                    <SelectItem value="ended" className="text-white hover:bg-[#2a2a2a] text-xs sm:text-sm">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                <HackathonFilters />
              </div>
            </div>

            {/* Active & Upcoming Hackathons */}
            {(statusFilter === "all" || statusFilter === "active" || statusFilter === "upcoming") && (
              <div className="space-y-4 sm:space-y-6 px-2">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Active & Upcoming Hackathons</h2>
                <div className="space-y-3 sm:space-y-4">
                  {loading ? (
                    // Loading skeletons for horizontal cards
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="rounded-lg border border-[#2a2a2a] overflow-hidden bg-[#111111] animate-pulse">
                        <div className="flex flex-col lg:flex-row h-full">
                          <div className="w-full lg:w-1/4 p-6">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                          </div>
                          <div className="w-full lg:w-1/3 p-6 border-x border-[#2a2a2a]">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-4 bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                          </div>
                          <div className="w-full lg:w-5/12 bg-[#121926] p-6">
                            <div className="h-8 bg-gray-700 rounded w-1/2 ml-auto mb-2"></div>
                            <div className="h-6 bg-gray-700 rounded w-1/3 ml-auto"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredHackathons.filter(h => h.status !== 'ended').length > 0 ? (
                    filteredHackathons
                      .filter(hackathon => hackathon.status !== 'ended')
                      .map((hackathon) => (
                        <HackathonCard key={hackathon.id} hackathon={hackathon} />
                      ))
                  ) : (
                    !loading && (
                      <div className="text-center py-6 sm:py-8 md:py-12 px-4">
                        <Code className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-white mb-2">
                          No active hackathons found
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed max-w-md mx-auto">
                          {searchTerm ? "Try adjusting your search" : "Get started by creating your first hackathon"}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                          <Button
                            onClick={() => setShowCreateDialog(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 py-2 sm:py-3"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Hackathon
                          </Button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Past Hackathons */}
            {(statusFilter === "all" || statusFilter === "ended") && (
              <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-8 px-2">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Past Hackathons</h2>
                <div className="space-y-3 sm:space-y-4">
                  {loading ? (
                    // Loading skeletons for past hackathons
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="rounded-lg border border-[#2a2a2a] overflow-hidden bg-[#111111] animate-pulse">
                        <div className="flex flex-col lg:flex-row h-full">
                          <div className="w-full lg:w-1/4 p-6">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                          </div>
                          <div className="w-full lg:w-1/3 p-6 border-x border-[#2a2a2a]">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-4 bg-gray-700 rounded"></div>
                              <div className="h-4 bg-gray-700 rounded"></div>
                            </div>
                          </div>
                          <div className="w-full lg:w-5/12 bg-[#121926] p-6">
                            <div className="h-8 bg-gray-700 rounded w-1/2 ml-auto"></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredHackathons.filter(h => h.status === 'ended').length > 0 ? (
                    filteredHackathons
                      .filter(hackathon => hackathon.status === 'ended')
                      .map((hackathon) => (
                        <HackathonCard key={hackathon.id} hackathon={hackathon} />
                      ))
                  ) : (
                    !loading && statusFilter !== "ended" && (
                      <div className="text-center py-6 sm:py-8 md:py-12 px-4">
                        <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-white mb-2">
                          No past hackathons yet
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                          Completed hackathons will appear here
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 px-2">
              <Card className="border border-[#2a2a2a] hover:border-blue-500/50 transition-all bg-[#111111] group">
                <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-400 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-medium text-white mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                    View All Projects
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                    Browse all submitted hackathon projects
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full border-[#2a2a2a] text-white hover:bg-blue-600 hover:border-blue-600 text-xs sm:text-sm py-2 px-3">
                    <Link href="/hacks/projects">View Projects</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-[#2a2a2a] hover:border-green-500/50 transition-all bg-[#111111] group">
                <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-400 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-medium text-white mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                    Voting Results
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                    View voting results and analytics
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full border-[#2a2a2a] text-white hover:bg-green-600 hover:border-green-600 text-xs sm:text-sm py-2 px-3">
                    <Link href="/hacks/results">View Results</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-[#2a2a2a] hover:border-purple-500/50 transition-all bg-[#111111] group">
                <CardContent className="p-3 sm:p-4 md:p-6 text-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-medium text-white mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
                    Payment Splits
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                    Manage contributor vs maintainer rewards
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full border-[#2a2a2a] text-white hover:bg-purple-600 hover:border-purple-600 text-xs sm:text-sm py-2 px-3">
                    <Link href="/hacks/payments">View Payments</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
