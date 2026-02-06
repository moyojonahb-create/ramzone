import { useAuth } from "@/hooks/useAuth";
import { Station } from "@/pages/Dashboard";
import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  station: Station | null;
}

const DashboardHeader = ({ station }: DashboardHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-foreground">
          {station ? station.name : "Station Dashboard"}
        </h1>
        {station && (
          <p className="text-sm text-muted-foreground">
            {station.is_approved ? (
              <span className="text-green-500">● Live & Approved</span>
            ) : (
              <span className="text-yellow-500">● Pending Approval</span>
            )}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-foreground hidden md:block">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
