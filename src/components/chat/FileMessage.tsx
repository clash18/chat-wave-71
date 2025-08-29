import { FileText, Image, Video, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileData {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'video' | 'document' | 'audio';
  url?: string;
  thumbnail?: string;
}

interface FileMessageProps {
  file: FileData;
  isSent?: boolean;
  onDownload?: (fileId: string) => void;
  onPreview?: (fileId: string) => void;
}

export function FileMessage({ 
  file, 
  isSent = false, 
  onDownload, 
  onPreview 
}: FileMessageProps) {
  const getFileIcon = () => {
    switch (file.type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getFileTypeColor = () => {
    switch (file.type) {
      case 'image':
        return 'text-green-600';
      case 'video':
        return 'text-blue-600';
      case 'audio':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  if (file.type === 'image' && file.thumbnail) {
    return (
      <div className={cn(
        "relative group overflow-hidden rounded-2xl max-w-xs",
        isSent ? "ml-auto" : "mr-auto"
      )}>
        <img 
          src={file.thumbnail} 
          alt={file.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            {onPreview && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => onPreview(file.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => onDownload(file.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {file.size}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-2xl border bg-card max-w-sm",
      isSent && "bg-message-sent text-message-sent-foreground border-transparent"
    )}>
      <div className={cn(
        "p-2 rounded-lg",
        isSent ? "bg-white/20" : "bg-muted",
        getFileTypeColor()
      )}>
        {getFileIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium text-sm truncate",
          isSent ? "text-message-sent-foreground" : "text-foreground"
        )}>
          {file.name}
        </p>
        <p className={cn(
          "text-xs",
          isSent ? "text-message-sent-foreground/70" : "text-muted-foreground"
        )}>
          {file.size} • {file.type}
        </p>
      </div>
      
      <div className="flex gap-1">
        {onPreview && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              isSent ? "hover:bg-white/20 text-message-sent-foreground" : ""
            )}
            onClick={() => onPreview(file.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 p-0",
              isSent ? "hover:bg-white/20 text-message-sent-foreground" : ""
            )}
            onClick={() => onDownload(file.id)}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}