import { useState } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2, Radio, Smartphone, BarChart3, Shield } from "lucide-react";
import AdminStationsPanel from "@/components/admin/AdminStationsPanel";
import AdminAppRequestsPanel from "@/components/admin/AdminAppRequestsPanel";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "stations", label: "Stations", icon: Radio },
  { id: "app-requests", label: "App Requests", icon: Smartphone },
];

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const [activeTab, setActiveTab] = useState("stations");

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Manage your platform</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <a href="/dashboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "stations" && <AdminStationsPanel />}
        {activeTab === "app-requests" && <AdminAppRequestsPanel />}
      </main>
    </div>
  );
};

export default Admin;
