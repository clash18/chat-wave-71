import { useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  contactName?: string;
}

export function MobileLayout({ 
  children, 
  sidebar, 
  showBackButton = false, 
  onBack, 
  contactName 
}: MobileLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-full">
      {/* Mobile header - only shown on small screens */}
      <div className="md:hidden flex items-center justify-between p-4 bg-chat-header border-b border-border">
        {showBackButton ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="font-medium">{contactName}</span>
          </div>
        ) : (
          <h1 className="text-lg font-semibold">Messages</h1>
        )}
        
        {!showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex h-full md:h-screen">
        {/* Sidebar */}
        <div
          className={cn(
            "md:block",
            sidebarOpen ? "block absolute inset-y-0 left-0 z-50 w-full max-w-sm bg-background shadow-lg" : "hidden"
          )}
        >
          {sidebar}
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 md:flex">
          {children}
        </div>
      </div>
    </div>
  );
}