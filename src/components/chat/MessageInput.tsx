import { useState, useRef } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  FileText,
  X,
  Pause,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { MessageData } from "./Message";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendVoiceMessage?: (voiceData: { duration: number; audioUrl?: string }) => void;
  onSendFile?: (fileData: any) => void;
  placeholder?: string;
  disabled?: boolean;
  replyTo?: MessageData | null;
  onCancelReply?: () => void;
}

export function MessageInput({ 
  onSendMessage,
  onSendVoiceMessage,
  onSendFile,
  placeholder = "Type a message...",
  disabled = false,
  replyTo,
  onCancelReply
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    // Start recording simulation
    const interval = setInterval(() => {
      setRecordingDuration(prev => {
        if (prev >= 60) {
          handleStopRecording();
          clearInterval(interval);
          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (recordingDuration > 0) {
      onSendVoiceMessage?.({
        duration: recordingDuration,
        audioUrl: undefined // In real app, this would be the recorded audio URL
      });
    }
    setRecordingDuration(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendFiles = () => {
    selectedFiles.forEach(file => {
      const fileData = {
        id: Date.now().toString(),
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileType(file.type),
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      };
      onSendFile?.(fileData);
    });
    setSelectedFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string): 'image' | 'video' | 'document' | 'audio' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'document';
  };

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'];

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background border-t border-border">
      {/* Reply Preview */}
      {replyTo && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-primary mb-1">
                Replying to {replyTo.senderName || 'You'}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {replyTo.text}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="ml-2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
            <Button variant="ghost" size="sm" onClick={handleSendFiles}>
              Send Files
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-muted rounded p-2">
                <div className="text-xs">
                  <div className="font-medium truncate max-w-24">{file.name}</div>
                  <div className="text-muted-foreground">{formatFileSize(file.size)}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}
                  className="h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recording UI */}
      {isRecording && (
        <div className="px-4 py-3 bg-destructive/10 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm font-medium text-destructive">Recording</span>
            </div>
            <div className="flex-1">
              <Progress value={(recordingDuration / 60) * 100} className="h-1" />
            </div>
            <span className="text-sm font-mono text-destructive">
              {formatRecordingTime(recordingDuration)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStopRecording}
              className="text-destructive hover:text-destructive"
            >
              <Pause className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* Attachment Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 mb-1"
                disabled={disabled || isRecording}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4 mr-2" />
                Photo & Video
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <FileText className="h-4 w-4 mr-2" />
                Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Recording voice message..." : placeholder}
              disabled={disabled || isRecording}
              className={cn(
                "min-h-[44px] max-h-32 resize-none pr-20 py-3 smooth-transition",
                "focus:ring-1 focus:ring-primary"
              )}
              rows={1}
              style={{
                height: "auto",
                minHeight: "44px",
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 128) + "px";
              }}
            />
            
            {/* Emoji Picker Button */}
            <DropdownMenu open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-12 bottom-1 h-8 w-8"
                  disabled={disabled || isRecording}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <div className="grid grid-cols-6 gap-1">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => {
                        setMessage(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Voice Record Button */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-1 bottom-1 h-8 w-8 smooth-transition",
                isRecording && "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              )}
              disabled={disabled}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || !message.trim() || isRecording}
            className="shrink-0 mb-1 gradient-primary glow-effect"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.pptx"
        onChange={handleFileSelect}
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileSelect}
      />
    </div>
  );
}