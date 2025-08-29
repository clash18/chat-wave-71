import { useRef, useEffect, useState } from "react";
import { Phone, Video, MoreVertical, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Message, MessageData } from "./Message";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
  isGroup?: boolean;
  memberCount?: number;
}

interface ChatWindowProps {
  contact?: Contact;
  messages: MessageData[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  typingUsers?: string[];
}

export function ChatWindow({ contact, messages, onSendMessage, isTyping = false, typingUsers = [] }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<MessageData | null>(null);
  const [localMessages, setLocalMessages] = useState<MessageData[]>(messages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSendMessage = (message: string) => {
    const newMessage: MessageData = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isDelivered: true,
      messageType: 'text',
      replyTo: replyTo ? {
        id: replyTo.id,
        text: replyTo.text || '',
        senderName: replyTo.senderName
      } : undefined
    };

    setLocalMessages(prev => [...prev, newMessage]);
    setReplyTo(null);
    onSendMessage(message);

    // Simulate auto-response after a delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I see what you mean 🤔",
        "Thanks for sharing that with me!",
        "Really? That's cool!",
        "I totally agree with you on that.",
        "Let me think about that for a moment...",
        "That makes perfect sense!",
        "Wow, I hadn't thought of it that way!"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: false,
        senderName: contact?.name,
        senderAvatar: contact?.avatar,
        messageType: 'text',
        reactions: Math.random() > 0.7 ? [
          { emoji: '👍', count: 1, userReacted: false },
          { emoji: '❤️', count: 2, userReacted: false }
        ] : undefined
      };
      
      setLocalMessages(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const handleSendVoiceMessage = (voiceData: { duration: number; audioUrl?: string }) => {
    const newMessage: MessageData = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isDelivered: true,
      messageType: 'voice',
      voiceData
    };

    setLocalMessages(prev => [...prev, newMessage]);
    onSendMessage("🎤 Voice message");
  };

  const handleSendFile = (fileData: any) => {
    const newMessage: MessageData = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isDelivered: true,
      messageType: fileData.type === 'image' ? 'image' : 'file',
      fileData
    };

    setLocalMessages(prev => [...prev, newMessage]);
    onSendMessage(`📎 ${fileData.name}`);
  };

  const handleReact = (messageId: string, emoji: string) => {
    setLocalMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        
        if (existingReaction) {
          if (existingReaction.userReacted) {
            // Remove reaction
            existingReaction.count = Math.max(0, existingReaction.count - 1);
            existingReaction.userReacted = false;
            if (existingReaction.count === 0) {
              return {
                ...msg,
                reactions: reactions.filter(r => r.emoji !== emoji)
              };
            }
          } else {
            // Add reaction
            existingReaction.count += 1;
            existingReaction.userReacted = true;
          }
        } else {
          // New reaction
          reactions.push({ emoji, count: 1, userReacted: true });
        }
        
        return { ...msg, reactions: [...reactions] };
      }
      return msg;
    }));
  };

  const handleReply = (message: MessageData) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--chat-background)' }}>
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
    <div className="flex-1 flex flex-col" style={{ background: 'var(--chat-background)' }}>
      {/* Enhanced Header */}
      <div className="p-4 bg-chat-header border-b border-border flex items-center justify-between smooth-transition">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            {contact.isOnline && !contact.isGroup && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-status-online rounded-full border-2 border-background" />
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-medium">{contact.name}</h2>
              {contact.isGroup && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {contact.memberCount || 0}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {contact.isGroup ? (
                `${contact.memberCount || 0} members`
              ) : contact.isOnline ? (
                <span className="text-status-online flex items-center gap-1">
                  <div className="w-2 h-2 bg-status-online rounded-full" />
                  Online
                </span>
              ) : contact.lastSeen ? (
                `Last seen ${contact.lastSeen}`
              ) : (
                "Offline"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-muted">
            <Video className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Search Messages</DropdownMenuItem>
              <DropdownMenuItem>Export Chat</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {localMessages.map((message, index) => {
          const showAvatar = contact.isGroup && !message.isSent && 
            (index === 0 || localMessages[index - 1].senderName !== message.senderName);
          
          return (
            <Message 
              key={message.id} 
              message={message} 
              showAvatar={showAvatar}
              onReact={handleReact}
              onReply={handleReply}
              onEdit={(id) => console.log('Edit message:', id)}
              onDelete={(id) => console.log('Delete message:', id)}
              onForward={(id) => console.log('Forward message:', id)}
            />
          );
        })}
        
        {/* Typing Indicator */}
        <TypingIndicator 
          isVisible={isTyping} 
          userNames={typingUsers}
        />
        
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onSendVoiceMessage={handleSendVoiceMessage}
        onSendFile={handleSendFile}
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
}