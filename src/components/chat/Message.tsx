import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Reply, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MessageReactions } from "./MessageReactions";
import { VoiceMessage } from "./VoiceMessage";
import { FileMessage } from "./FileMessage";

export interface MessageData {
  id: string;
  text?: string;
  timestamp: string;
  isSent: boolean;
  isDelivered?: boolean;
  isRead?: boolean;
  senderName?: string;
  senderAvatar?: string;
  messageType?: 'text' | 'voice' | 'file' | 'image';
  voiceData?: {
    duration: number;
    audioUrl?: string;
  };
  fileData?: {
    id: string;
    name: string;
    size: string;
    type: 'image' | 'video' | 'document' | 'audio';
    url?: string;
    thumbnail?: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    userReacted?: boolean;
  }>;
  replyTo?: {
    id: string;
    text: string;
    senderName?: string;
  };
}

interface MessageProps {
  message: MessageData;
  showAvatar?: boolean;
  onReact?: (messageId: string, emoji: string) => void;
  onReply?: (message: MessageData) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
}

export function Message({ 
  message, 
  showAvatar = false, 
  onReact,
  onReply,
  onEdit,
  onDelete,
  onForward
}: MessageProps) {
  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const handleReact = (messageId: string, emoji: string) => {
    onReact?.(messageId, emoji);
  };

  const handleShowReactionPicker = (messageId: string) => {
    // This would open an emoji picker - for now, add a random reaction
    const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    handleReact(messageId, randomEmoji);
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'voice':
        return message.voiceData && (
          <VoiceMessage
            duration={message.voiceData.duration}
            audioUrl={message.voiceData.audioUrl}
            isSent={message.isSent}
          />
        );
      case 'file':
      case 'image':
        return message.fileData && (
          <FileMessage
            file={message.fileData}
            isSent={message.isSent}
          />
        );
      default:
        return (
          <div
            className={cn(
              "px-4 py-2 rounded-2xl relative max-w-md break-words message-enter",
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
            
            {message.replyTo && (
              <div className={cn(
                "border-l-2 pl-2 mb-2 text-xs rounded",
                message.isSent 
                  ? "border-white/30 bg-white/10" 
                  : "border-primary/30 bg-muted/50"
              )}>
                <div className="font-medium opacity-80">
                  {message.replyTo.senderName || 'You'}
                </div>
                <div className="opacity-70 truncate">
                  {message.replyTo.text}
                </div>
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
        );
    }
  };

  return (
    <div
      className={cn(
        "group flex gap-2 mb-4 max-w-[80%] relative",
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

      <div className="flex flex-col">
        {renderMessageContent()}
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <MessageReactions
            messageId={message.id}
            reactions={message.reactions}
            onReact={handleReact}
            onShowReactionPicker={handleShowReactionPicker}
          />
        )}
      </div>

      {/* Message actions on hover */}
      <div className={cn(
        "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
        message.isSent ? "left-0 -translate-x-full" : "right-0 translate-x-full"
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 bg-background shadow-md hover:bg-muted"
          onClick={() => handleShowReactionPicker(message.id)}
        >
          <span className="text-xs">😀</span>
        </Button>
        
        <Button
          variant="ghost" 
          size="sm"
          className="h-6 w-6 p-0 bg-background shadow-md hover:bg-muted"
          onClick={() => onReply?.(message)}
        >
          <Reply className="h-3 w-3" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm" 
              className="h-6 w-6 p-0 bg-background shadow-md hover:bg-muted"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {onForward && (
              <DropdownMenuItem onClick={() => onForward(message.id)}>
                Forward
              </DropdownMenuItem>
            )}
            {message.isSent && onEdit && (
              <DropdownMenuItem onClick={() => onEdit(message.id)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={() => onDelete(message.id)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}