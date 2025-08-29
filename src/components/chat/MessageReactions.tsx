import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Reaction {
  emoji: string;
  count: number;
  userReacted?: boolean;
}

interface MessageReactionsProps {
  messageId: string;
  reactions: Reaction[];
  onReact: (messageId: string, emoji: string) => void;
  onShowReactionPicker: (messageId: string) => void;
}

export function MessageReactions({ 
  messageId, 
  reactions, 
  onReact, 
  onShowReactionPicker 
}: MessageReactionsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const visibleReactions = showAll ? reactions : reactions.slice(0, 3);
  const hasMoreReactions = reactions.length > 3;

  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {visibleReactions.map((reaction, index) => (
        <Button
          key={`${reaction.emoji}-${index}`}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 py-1 text-xs rounded-full reaction-hover",
            "bg-reaction-bg hover:bg-reaction-hover",
            reaction.userReacted && "bg-reaction-active text-white"
          )}
          onClick={() => onReact(messageId, reaction.emoji)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
      
      {hasMoreReactions && !showAll && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 py-1 text-xs rounded-full bg-reaction-bg hover:bg-reaction-hover"
          onClick={() => setShowAll(true)}
        >
          +{reactions.length - 3}
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded-full bg-reaction-bg hover:bg-reaction-hover"
        onClick={() => onShowReactionPicker(messageId)}
      >
        <span className="text-xs">😀</span>
      </Button>
    </div>
  );
}