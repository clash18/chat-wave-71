import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, MessageCircle, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen?: string;
  isContact?: boolean;
}

export default function Contacts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Alice Johnson",
      username: "alice.j",
      avatar: "",
      bio: "UX Designer at TechCorp",
      isOnline: true,
      isContact: true
    },
    {
      id: "2", 
      name: "Bob Smith",
      username: "bobsmith",
      avatar: "",
      bio: "Full-stack developer",
      isOnline: false,
      lastSeen: "2h ago",
      isContact: true
    },
    {
      id: "3",
      name: "Carol White",
      username: "carol_w",
      avatar: "",
      bio: "Product Manager",
      isOnline: true,
      isContact: false
    },
    {
      id: "4",
      name: "David Brown",
      username: "david.brown",
      avatar: "",
      bio: "Marketing Specialist",
      isOnline: false,
      lastSeen: "1d ago",
      isContact: false
    },
    {
      id: "5",
      name: "Emma Wilson",
      username: "emma_w",
      avatar: "",
      bio: "DevOps Engineer",
      isOnline: true,
      isContact: true
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contacts = filteredUsers.filter(user => user.isContact);
  const nonContacts = filteredUsers.filter(user => !user.isContact);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddContact = (userId: string) => {
    // TODO: Replace with actual API call
    toast({
      title: "Contact added",
      description: "User has been added to your contacts.",
    });
  };

  const handleRemoveContact = (userId: string) => {
    // TODO: Replace with actual API call
    toast({
      title: "Contact removed",
      description: "User has been removed from your contacts.",
    });
  };

  const handleStartChat = (userId: string) => {
    // TODO: Navigate to chat with this user
    toast({
      title: "Starting chat",
      description: "Opening conversation...",
    });
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card key={user.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{user.name}</h3>
                {user.isContact && (
                  <Badge variant="secondary" className="text-xs">
                    Contact
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              {user.bio && (
                <p className="text-xs text-muted-foreground truncate mt-1">{user.bio}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {user.isOnline ? (
                  <span className="text-green-600">Online</span>
                ) : user.lastSeen ? (
                  `Last seen ${user.lastSeen}`
                ) : (
                  "Offline"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleStartChat(user.id)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.isContact ? (
                  <DropdownMenuItem onClick={() => handleRemoveContact(user.id)}>
                    Remove Contact
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleAddContact(user.id)}>
                    Add Contact
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>View Profile</DropdownMenuItem>
                <DropdownMenuItem>Block User</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your contacts and discover new people
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* My Contacts */}
        {contacts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">My Contacts ({contacts.length})</h2>
            <div className="space-y-2">
              {contacts.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {/* Discover People */}
        {nonContacts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Discover People</h2>
            <div className="space-y-2">
              {nonContacts.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {filteredUsers.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}