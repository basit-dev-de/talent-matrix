import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FormInput,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Jobs",
      icon: Briefcase,
      path: "/jobs",
    },
    {
      title: "Applications",
      icon: Users,
      path: "/applications",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:relative",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden",
            !isOpen && "opacity-0"
          )}
        >
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            TM
          </div>
          <span className="font-semibold whitespace-nowrap">TalentMatrix</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden md:flex"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Button
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 transition-all",
                  !isOpen && "justify-center px-0"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
                <span className={cn("whitespace-nowrap", !isOpen && "hidden")}>
                  {item.title}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <div
          className={cn("text-xs text-muted-foreground", !isOpen && "hidden")}
        >
          <p>TalentMatrix ATS</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
