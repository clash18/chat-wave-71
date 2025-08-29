import { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceMessageProps {
  duration: number;
  audioUrl?: string;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  isSent?: boolean;
}

export function VoiceMessage({ 
  duration, 
  audioUrl, 
  isPlaying = false, 
  onPlay, 
  onPause,
  isSent = false
}: VoiceMessageProps) {
  const [currentTime, setCurrentTime] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-2xl min-w-48",
      isSent 
        ? "bg-message-sent text-message-sent-foreground" 
        : "bg-voice-bg border"
    )}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 w-8 rounded-full p-0",
          isSent ? "hover:bg-white/20" : "hover:bg-muted"
        )}
        onClick={handleTogglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>

      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-1 h-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 bg-voice-wave rounded-full voice-wave",
                isPlaying ? "opacity-100" : "opacity-60"
              )}
              style={{
                height: `${Math.random() * 12 + 4}px`,
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            />
          ))}
        </div>
        
        <span className={cn(
          "text-xs font-medium",
          isSent ? "text-message-sent-foreground/80" : "text-muted-foreground"
        )}>
          {formatTime(isPlaying ? currentTime : duration)}
        </span>
      </div>

      <Mic className={cn(
        "h-4 w-4",
        isSent ? "text-message-sent-foreground/60" : "text-muted-foreground"
      )} />
    </div>
  );
}