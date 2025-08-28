import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

export interface MessageData {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  senderName?: string;
  senderAvatar?: string;
}

interface MessageProps {
  message: MessageData;
  showAvatar?: boolean;
}

export function Message({ message, showAvatar = false }: MessageProps) {
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <div
      className={cn(
        "flex gap-2 mb-4 max-w-[80%]",
        message.isSent ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {showAvatar && !message.isSent && (
        <Avatar className="h-8 w-8 mt-auto">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback className="text-xs bg-muted">
            {getInitials(message.senderName || '')}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "px-4 py-2 rounded-2xl relative max-w-md break-words",
          message.isSent
            ? "bg-message-sent text-message-sent-foreground rounded-br-md"
            : "bg-message-received text-message-received-foreground rounded-bl-md shadow-sm border"
        )}
      >
        {!message.isSent && showAvatar && message.senderName && (
          <div className="text-xs font-medium text-primary mb-1">
            {message.senderName}
          </div>
        )}
        
        <p className="text-sm leading-relaxed">{message.text}</p>
        
        <div
          className={cn(
            "flex items-center gap-1 mt-1 text-xs",
            message.isSent 
              ? "text-message-sent-foreground/70 justify-end" 
              : "text-message-received-foreground/60"
          )}
        >
          <span>{message.timestamp}</span>
          {message.isSent && (
            <div className="ml-1">
              {message.isRead ? (
                <CheckCheck className="h-3 w-3 text-blue-400" />
              ) : message.isDelivered ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}