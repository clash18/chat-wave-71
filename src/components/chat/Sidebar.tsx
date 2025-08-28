import { useState } from "react";
import { Search, MessageCircle, Users, Settings, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isGroup?: boolean;
}

interface SidebarProps {
  contacts: Contact[];
  selectedContactId?: string;
  onContactSelect: (contactId: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Sidebar({ contacts, selectedContactId, onContactSelect, isDark, onThemeToggle }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="w-80 h-full bg-chat-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 bg-chat-header border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Messages</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            All
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </Button>
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => onContactSelect(contact.id)}
            className={cn(
              "p-3 cursor-pointer transition-colors border-b border-border/50",
              "hover:bg-chat-sidebar-hover",
              selectedContactId === contact.id && "bg-chat-sidebar-active"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                {contact.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-status-online rounded-full border-2 border-background" />
                )}
                {contact.isGroup && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                    <Users className="h-2 w-2" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.lastMessage}
                  </p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}