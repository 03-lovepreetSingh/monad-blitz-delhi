"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Code, ExternalLink, Link2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatUSD } from "@/lib/utils";

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

interface HackathonCardProps {
  hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "upcoming":
        return <Badge variant="live" className="uppercase text-xs">Upcoming</Badge>;
      case "active":
        return <Badge variant="live" className="uppercase text-xs">Live</Badge>;
      case "ended":
        return <Badge variant="ended" className="uppercase text-xs">Ended</Badge>;
      case "voting":
        return <Badge variant="voting" className="uppercase text-xs">Voting</Badge>;
      default:
        return <Badge variant="outline" className="uppercase text-xs">Unknown</Badge>;
    }
  };

  // Generate hackathon-specific branding colors
  const getHackathonBranding = (name: string) => {
    const hash = name.toLowerCase().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorSchemes = [
      { bgColor: 'bg-[#121926]', textColor: 'text-yellow-400' },
      { bgColor: 'bg-[#121926]', textColor: 'text-purple-400' },
      { bgColor: 'bg-[#0a0b2e]', textColor: 'text-blue-400' },
      { bgColor: 'bg-[#062626]', textColor: 'text-teal-400' },
    ];
    return colorSchemes[hash % colorSchemes.length];
  };

  const calculateDaysLeft = () => {
    const now = new Date();
    const end = new Date(hackathon.end_date);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const branding = getHackathonBranding(hackathon.name);
  const daysLeft = calculateDaysLeft();
  const participants = Math.floor(Math.random() * 500) + 200; // Mock data for now

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const isActive = () => {
    const now = new Date();
    const start = new Date(hackathon.start_date);
    const end = new Date(hackathon.end_date);
    return now >= start && now <= end;
  };

  const isUpcoming = () => {
    const now = new Date();
    const start = new Date(hackathon.start_date);
    return now < start;
  };

  return (
    <Link href={`/hacks/${hackathon.id}`} className="block">
      <div className="rounded-lg border border-[#2a2a2a] overflow-hidden hover:border-blue-500/50 transition-all bg-[#111111] group">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Section - Title and Status */}
          <div className="w-full lg:w-1/4 p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-white">
                  {hackathon.name}
                </h3>
                {getStatusBadge(hackathon.status)}
              </div>
              <p className="text-gray-400 text-sm mb-auto">
                {hackathon.description ||
                  `${hackathon.name} Hackathon was born from a simple but radical belief: true innovation shouldn't be strangled by black-box algorithms or centralized gatekeepers.`
                }
              </p>
            </div>
          </div>

          {/* Middle Section - Details */}
          <div className="w-full lg:w-1/3 p-6 border-x border-[#2a2a2a]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-400 text-sm">
                  Registration close
                </p>
                <p className="font-medium text-white">
                  {hackathon.status === 'ended' ? 'Registration ended' : `Registration ${daysLeft} days left`}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Tech stack</p>
                <p className="font-medium text-white">All tech stack</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Level</p>
                <p className="font-medium text-white">All levels accepted</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="font-medium text-white">
                  {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 flex-wrap">
              <div className="bg-[#222222] px-4 py-1.5 rounded-full text-sm flex items-center text-white">
                Online
              </div>
              <div className="bg-[#222222] px-4 py-1.5 rounded-full text-sm flex items-center gap-1.5 text-white">
                <Users className="h-3.5 w-3.5" />
                <span>{participants} Participants</span>
              </div>
            </div>
          </div>

          {/* Right Section - Branding */}
          <div className={`w-full lg:w-5/12 ${branding.bgColor} p-6 flex items-center`}>
            <div className="flex-1">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-5 w-5 text-white" />
                  <span className="text-lg font-semibold text-white">
                    {hackathon.name}
                  </span>
                </div>
                <h4 className={`text-2xl font-bold ${branding.textColor} text-right`}>
                  HACKATHON
                </h4>
                <p className={`${branding.textColor} mt-1 text-right`}>
                  {hackathon.description || 'Innovation & Building'}
                </p>
                <div className="mt-4 text-right">
                  <div className="text-gray-400 text-xs">
                    PRIZE POOL
                  </div>
                  <div className="text-2xl font-bold text-white">
                    ${(Math.floor(Math.random() * 50000) + 10000).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
