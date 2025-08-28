import { useRef, useEffect } from "react";
import { Phone, Video, MoreVertical, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Message, MessageData } from "./Message";
import { MessageInput } from "./MessageInput";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  isGroup?: boolean;
}

interface ChatWindowProps {
  contact?: Contact;
  messages: MessageData[];
  onSendMessage: (message: string) => void;
}

export function ChatWindow({ contact, messages, onSendMessage }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-background">
        <div className="text-center">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg 
              className="w-16 h-16 text-muted-foreground" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">Welcome to Chat</h3>
          <p className="text-muted-foreground">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-chat-background">
      {/* Header */}
      <div className="p-4 bg-chat-header border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-sm text-muted-foreground">
              {contact.isOnline ? (
                <span className="text-status-online">Online</span>
              ) : contact.lastSeen ? (
                `Last seen ${contact.lastSeen}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message, index) => {
          const showAvatar = contact.isGroup && !message.isSent && 
            (index === 0 || messages[index - 1].senderName !== message.senderName);
          
          return (
            <Message 
              key={message.id} 
              message={message} 
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}