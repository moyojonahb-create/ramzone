import { Station } from "@/pages/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Clock, TrendingUp, Radio } from "lucide-react";

interface AnalyticsPanelProps {
  station: Station | null;
}

const AnalyticsPanel = ({ station }: AnalyticsPanelProps) => {
  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Radio className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          No Station Yet
        </h3>
        <p className="text-muted-foreground">
          Create your station first to view analytics
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Listeners",
      value: station.listeners_count.toLocaleString(),
      change: "+12%",
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Live Status",
      value: station.is_live ? "Broadcasting" : "Offline",
      change: station.is_live ? "Live Now" : "",
      icon: Radio,
      color: station.is_live ? "text-live" : "text-muted-foreground",
    },
    {
      label: "Avg. Listen Time",
      value: "24 mins",
      change: "+5%",
      icon: Clock,
      color: "text-accent",
    },
    {
      label: "Peak Listeners",
      value: "1,234",
      change: "Today",
      icon: TrendingUp,
      color: "text-secondary-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Analytics</h2>
        <p className="text-muted-foreground">Track your station's performance and listener engagement</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Listener Trends
          </CardTitle>
          <CardDescription>Daily listener count over the past 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-secondary/50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Analytics data will appear here once your station goes live
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-xl">Recent Listener Sessions</CardTitle>
          <CardDescription>Track when and how long listeners tune in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Anonymous Listener</p>
                    <p className="text-sm text-muted-foreground">Harare, Zimbabwe</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">18 mins</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
