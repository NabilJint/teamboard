"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  Folder,
  CheckSquare,
  Settings,
  CreditCard,
  Shield,
  Users,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/home", label: "Overview", icon: <Home /> },
  { name: "Projects", href: "/cards", label: "Projects", icon: <Folder />, active: true },
  { name: "Tasks", href: "/analytics", label: "Tasks", icon: <CheckSquare /> },
  { name: "Members", href: "/transfers", label: "Team Members", icon: <Users /> },
];

const secondaryItems = [
  { name: "All Projects", icon: <Folder /> },
  { name: "My Tasks", icon: <CheckSquare /> },
  { name: "Team Settings", icon: <Settings /> },
  { name: "Billing", icon: <CreditCard /> },
  { name: "Audit Logs", icon: <Shield /> },
];

const recentProjects = [
  { name: "Mobile App Redesign", status: "Active", progress: 68 },
  { name: "Dashboard v2", status: "Active", progress: 45 },
  { name: "API Migration", status: "Paused", progress: 90 },
  { name: "Onboarding Flow", status: "Done", progress: 100 },
];

const ProjectRow = ({ name, status, progress }: { name: string; status: string; progress: number }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
    <div className="flex items-center gap-3">
      <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-900">
        {name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">Project • Updated 2h ago</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "text-xs font-medium px-2 py-1 rounded-lg",
          status === "Active"
            ? "bg-slate-100 text-slate-900"
            : status === "Paused"
            ? "bg-amber-100 text-amber-700"
            : "bg-emerald-100 text-emerald-700"
        )}
      >
        {status}
      </span>
      <div className="w-24 h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className="h-full bg-slate-900" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </div>
);

const projectsByStatus = [
  { name: "Active", count: 12, pct: 60 },
  { name: "Paused", count: 4, pct: 20 },
  { name: "Done", count: 4, pct: 20 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen text-slate-900">
      <div className="w-full min-h-screen flex flex-col xl:flex-row p-4 sm:p-6 lg:p-7 gap-6 max-w-[1720px] mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="w-full xl:w-[285px] flex-shrink-0 flex flex-col justify-between gap-6 h-[calc(100vh_-3.5rem)]">
          <div className="flex flex-col gap-5 overflow-y-auto flex-1 min-h-0 no-scrollbar">
            {/* Logo & Header Toggle */}
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white/70 border border-white flex items-center justify-center shadow-sm shadow-slate-900/5">
                  <span className="font-black text-lg tracking-tighter text-slate-900">TB</span>
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                  TeamBoard
                </span>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900/10 text-slate-700 border border-slate-900/10 tracking-wider">
                  PRO
                </span>
              </div>
              <button className="w-9 h-9 thick-glass-pill flex items-center justify-center text-slate-600 hover:text-slate-900 transition hover:bg-white/80" title="Collapse sidebar">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect height="18" rx="4" width="18" x="3" y="3"></rect>
                  <line x1="9" x2="9" y1="3" y2="21"></line>
                </svg>
              </button>
            </div>
            {/* Search Input */}
            <div className="relative">
              <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"></path>
              </svg>
              <Input
                type="text"
                placeholder="Search projects, tasks..."
                className="w-full pl-11 pr-4 py-2.5 thick-glass-pill text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition cursor-pointer"
              />
            </div>
            {/* 2x2 Primary Matrix Navigation Tiles */}
            <div className="grid grid-cols-2 gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col justify-between h-[98px] p-3.5 rounded-[20px] transition",
                    item.active ? "thick-obsidian-pill" : "glass-tile-btn"
                  )}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
                    {item.active ? (
                      <div className="bg-white/15 flex items-center justify-center text-white shadow-inner">{item.icon}</div>
                    ) : (
                      <div className="bg-white/70 flex items-center justify-center text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition shadow-sm">{item.icon}</div>
                    )}
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-medium leading-none", item.active ? "text-slate-300" : "text-slate-400")}>
                      {item.label}
                    </p>
                    <p className={cn("text-xs font-bold mt-1", item.active ? "text-white" : "text-slate-900")}>
                      {item.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {/* Secondary Action Menu Items */}
            <nav className="space-y-1.5 pt-2">
              {secondaryItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-white/60 transition group"
                >
                  <div className="w-7 h-7 rounded-xl bg-white/60 flex items-center justify-center text-slate-500 group-hover:text-slate-900 shadow-sm">
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
          {/* Bottom Profile Card & Pro Badge */}
          <div className="pt-4 mt-2">
            <div className="thick-glass-card p-3.5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    AL
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full absolute -top-1 -right-1"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-slate-900">Alvie</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">PRO</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">alvie@teamboard.dev</p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-xl bg-white/60 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 transition" title="Log out">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round"></path>
                </svg>
              </button>
            </div>
          </div>
        </aside>
        {/* MAIN DASHBOARD BODY */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Top Header Navigation */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Good Morning, Alvie</h1>
              <p className="text-xs font-bold text-slate-500 mt-0.5">Friday, 15 July 2026</p>
            </div>
            <div className="flex items-center gap-3">
              {/* New Project Button */}
              <Button variant="default" size="sm" className="px-4 py-2.5 text-xs font-bold flex items-center gap-2">
                New Project
              </Button>
              {/* New Task Pill */}
              <button className="thick-glass-pill px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-white/80 transition cursor-pointer">
                New Task
              </button>
              {/* Notification Bell */}
              <button className="relative w-10 h-10 thick-glass-pill flex items-center justify-center text-slate-700 hover:bg-white/90 transition" title="Notifications">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span className="w-2 h-2 bg-emerald-500 rounded-full absolute top-2 right-2 ring-2 ring-white"></span>
              </button>
              {/* Small Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center border-2 border-white shadow-md">
                AL
              </div>
            </div>
          </header>
          {/* KPI Metrics Row (4 Thick Liquid Glass Cards) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="thick-glass-card p-5 flex flex-col justify-between h-[128px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Projects</span>
                <svg className="w-16 h-5 stroke-slate-800 fill-none stroke-[2.2]" viewBox="0 0 60 20">
                  <path d="M 2 16 Q 14 18, 22 10 T 38 12 T 52 4 T 58 6" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">12</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/40">+6.3%</span>
              </div>
            </div>
            <div className="thick-glass-card p-5 flex flex-col justify-between h-[128px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Active Tasks</span>
                <svg className="w-16 h-5 stroke-slate-800 fill-none stroke-[2.2]" viewBox="0 0 60 20">
                  <path d="M 2 14 Q 15 4, 28 14 T 44 8 T 58 12" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">24</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/40">+7.1%</span>
              </div>
            </div>
            <div className="thick-glass-card p-5 flex flex-col justify-between h-[128px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Team Members</span>
                <svg className="w-16 h-5 stroke-emerald-600 fill-none stroke-[2.2]" viewBox="0 0 60 20">
                  <path d="M 2 15 Q 16 15, 26 9 T 42 6 T 58 3" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">8</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/40">+5.7%</span>
              </div>
            </div>
            <div className="thick-glass-card p-5 flex flex-col justify-between h-[128px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Completion Rate</span>
                <svg className="w-16 h-5 stroke-emerald-600 fill-none stroke-[2.2]" viewBox="0 0 60 20">
                  <path d="M 2 12 Q 18 16, 30 10 T 46 6 T 58 4" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-2xl font-black text-slate-950 tracking-tight">94%</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/40">+5.2%</span>
              </div>
            </div>
          </section>
          {/* Center & Right 2-Column Core Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CENTER RECENT PROJECTS HERO (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="thick-glass-card p-6 sm:p-7">
                <div className="w-full flex items-center justify-between mb-4">
                  <div className="text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Recent Projects</span>
                    <h2 className="text-lg font-black text-slate-900">All Projects</h2>
                  </div>
                </div>
                <div className="space-y-0">
                  {recentProjects.map((p) => (
                    <ProjectRow key={p.name} {...p} />
                  ))}
                </div>
              </div>
            </div>
            {/* RIGHT ANALYTICS SUITE (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks Completed per Day */}
                <div className="thick-glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Tasks Completed per Day</h3>
                      <p className="text-sm font-black text-slate-900 mt-0.5">This Week</p>
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full thick-obsidian-pill">+12%</span>
                  </div>
                  <div className="flex items-end justify-between gap-1.5 h-28 my-4 px-1">
                    {[38, 55, 80, 100, 65, 42, 25].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1 h-full justify-end">
                        <div className={cn("w-full rounded-md", i === 3 ? "bg-slate-900 text-white" : "bg-white/85")} style={{ height: `${h}%` }}></div>
                        <span className={cn("text-[9px] font-bold", i === 3 ? "text-slate-900" : "text-slate-400")}>
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-white/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Daily average</span>
                    <span className="font-extrabold text-slate-900">12 tasks</span>
                  </div>
                </div>
                {/* Active Assignments */}
                <div className="thick-glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Active Assignments</h3>
                      <p className="text-sm font-black text-slate-900 mt-0.5">This Week</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">24</span>
                  </div>
                  <div className="my-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-950 tracking-tight">18</span>
                      <p className="text-[11px] font-bold text-emerald-700 mt-0.5">completed today</p>
                    </div>
                    <div className="flex gap-1 items-end h-12">
                      <div className="w-1.5 h-6 bg-slate-400/50 rounded-full"></div>
                      <div className="w-1.5 h-8 bg-slate-400/60 rounded-full"></div>
                      <div className="w-1.5 h-10 bg-slate-700 rounded-full"></div>
                      <div className="w-1.5 h-12 bg-slate-950 rounded-full"></div>
                      <div className="w-1.5 h-7 bg-slate-400/60 rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Pending review</span>
                    <span className="font-extrabold text-slate-900">6 tasks</span>
                  </div>
                </div>
              </div>
              {/* Projects by Status */}
              <div className="thick-glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Projects by Status</h3>
                    <p className="text-sm font-black text-slate-900">Project Breakdown</p>
                  </div>
                  <button className="thick-glass-pill px-3 py-1 text-[11px] font-bold text-slate-700 hover:bg-white/80 transition">
                    This Month ▼
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {projectsByStatus.map((cat) => (
                    <div key={cat.name} className="sub-glass-panel p-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{cat.name}</span>
                      <p className="text-sm font-black text-slate-900 mt-1">{cat.count}</p>
                      <div className="w-full bg-slate-900/10 h-1 rounded-full mt-2 overflow-hidden">
                        <div className="bg-slate-900 h-full rounded-full" style={{ width: `${cat.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tasks Completed */}
                <div className="thick-glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Tasks Completed</h3>
                      <p className="text-base font-black text-slate-950 mt-0.5">142</p>
                    </div>
                    <button className="w-8 h-8 thick-glass-pill flex items-center justify-center text-slate-700 hover:bg-white/80">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="7" x2="17" y1="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-end justify-between gap-1 h-16 my-3 px-1">
                    {[30, 45, 40, 60, 95, 70, 50, 35].map((h) => (
                      <div key={h} className={cn("w-2 rounded-t", h >= 95 ? "bg-slate-900" : "bg-slate-300")} style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] font-bold px-1">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
                      <span key={m} className={m === "Apr" ? "text-slate-900 font-extrabold" : "text-slate-400"}>{m}</span>
                    ))}
                  </div>
                </div>
                {/* Plan Usage Progress Bar */}
                <div className="thick-glass-card p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Plan Usage</h3>
                      <p className="text-base font-black text-slate-950 mt-0.5">3 / 10 Projects</p>
                    </div>
                    <button className="thick-glass-pill px-3 py-1 text-[11px] font-bold text-slate-600 hover:bg-white/80">View All</button>
                  </div>
                  <div className="mt-4">
                    <Progress value={30} />
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/60">
                    <span className="text-slate-500 font-medium">Plan: FREE</span>
                    <span className="text-emerald-700 font-extrabold">Good Standing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
