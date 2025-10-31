"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LogOut,
  Users,
  Zap,
  TrendingUp,
  Settings,
  FileText,
  X,
} from "lucide-react";
import { SolarShareLogo } from "@/components/logo";

// 🔥 Firestore Imports (for EV charging requests)
import { db } from "@/lib/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [showLogs, setShowLogs] = useState(false);

  // 🧠 New state for EV requests
  const [requests, setRequests] = useState<any[]>([]);

  // ✅ Real-time Firestore listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "ev_charging_requests"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(data);
    });
    return () => unsub();
  }, []);

  // 🔒 Protect Admin Route
  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // 🔧 System Logs (existing)
  const systemLogs = [
    {
      id: 1,
      timestamp: "2025-01-10 14:32:45",
      action: "EV Charging Session Started",
      user: "owner@solargrid.com",
      status: "success",
    },
    {
      id: 2,
      timestamp: "2025-01-10 14:35:12",
      action: "Payment Processed",
      user: "owner@solargrid.com",
      details: "₹87.60",
      status: "success",
    },
    {
      id: 3,
      timestamp: "2025-01-10 14:38:20",
      action: "Payout Request Created",
      user: "solar@solargrid.com",
      status: "pending",
    },
    {
      id: 4,
      timestamp: "2025-01-10 14:42:33",
      action: "Payout Approved",
      user: "admin@solargrid.com",
      details: "₹1245.50",
      status: "success",
    },
    {
      id: 5,
      timestamp: "2025-01-10 14:50:15",
      action: "System Backup Started",
      user: "system",
      status: "processing",
    },
    {
      id: 6,
      timestamp: "2025-01-10 15:02:48",
      action: "System Backup Completed",
      user: "system",
      details: "5.2 GB",
      status: "success",
    },
    {
      id: 7,
      timestamp: "2025-01-10 15:15:22",
      action: "Member Report Generated",
      user: "admin@solargrid.com",
      status: "success",
    },
    {
      id: 8,
      timestamp: "2025-01-10 15:28:45",
      action: "Grid Stability Check",
      user: "system",
      details: "98.2%",
      status: "success",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <SolarShareLogo className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SolarShare</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Admin Control Panel</h2>
          <p className="text-muted-foreground">Manage the entire SolarShare network</p>
        </div>

        {/* ⚡ NEW SECTION: Live EV Charging Requests */}
        <Card className="mb-10 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              ⚡ Live EV Charging Requests
            </CardTitle>
            <CardDescription>
              See all EV charging requests submitted by vehicle owners in real time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-muted-foreground">No EV charging requests yet.</p>
            ) : (
              <ul className="space-y-3">
                {requests.map((req) => (
                  <li
                    key={req.id}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{req.user}</p>
                        <p className="text-sm text-muted-foreground">
                          {req.vehicle} — {req.charger_type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {req.time?.seconds
                            ? new Date(req.time.seconds * 1000).toLocaleString()
                            : new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Existing Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Active Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">4</div>
              <p className="text-xs text-green-600 mt-1">All active</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Total Solar Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">45.8 kW</div>
              <p className="text-xs text-blue-600 mt-1">Community total</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹12,450</div>
              <p className="text-xs text-orange-600 mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                System Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">71%</div>
              <p className="text-xs text-green-600 mt-1">Solar to charging</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/members">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <Users className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Manage Members</p>
                <p className="text-xs text-muted-foreground">Add, edit, or remove members</p>
              </div>
            </Button>
          </Link>

          <Link href="/stations">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <Zap className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Charging Stations</p>
                <p className="text-xs text-muted-foreground">Monitor and control stations</p>
              </div>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <TrendingUp className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Analytics & Reports</p>
                <p className="text-xs text-muted-foreground">View detailed analytics</p>
              </div>
            </Button>
          </Link>

          <Link href="/admin">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <Settings className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">System Settings</p>
                <p className="text-xs text-muted-foreground">Configure system parameters</p>
              </div>
            </Button>
          </Link>

          <Link href="/settings">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <Zap className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Regional Settings</p>
                <p className="text-xs text-muted-foreground">Manage regional configuration</p>
              </div>
            </Button>
          </Link>

          <Link href="/">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <TrendingUp className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Home</p>
                <p className="text-xs text-muted-foreground">View main page</p>
              </div>
            </Button>
          </Link>

          {/* Add reservations management button */}
          <Link href="/admin/reservations">
            <Button variant="outline" className="w-full justify-start gap-2 h-auto py-4 bg-transparent">
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <p className="font-semibold">Reservation Requests</p>
                <p className="text-xs text-muted-foreground">Manage station reservations</p>
              </div>
            </Button>
          </Link>
        </div>

        {/* Admin Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Overall system health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Grid Stability</span>
                <span className="font-bold text-green-600">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="font-bold text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Charging Sessions</span>
                <span className="font-bold text-foreground">3</span>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-4" onClick={() => setShowLogs(true)}>
                View System Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common admin tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Distribute Monthly Profits
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Generate Reports
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Send Community Notification
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Backup System Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* System Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system activities and events</CardDescription>
              </div>
              <button onClick={() => setShowLogs(false)} className="p-1 hover:bg-muted rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
              <div className="space-y-3 py-4">
                {systemLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground">{log.action}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              log.status === "success"
                                ? "bg-green-100 text-green-800"
                                : log.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">User: {log.user}</p>
                        <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Details: {log.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
