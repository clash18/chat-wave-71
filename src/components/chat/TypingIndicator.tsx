interface TypingIndicatorProps {
  isVisible: boolean;
  userNames?: string[];
}

export function TypingIndicator({ isVisible, userNames }: TypingIndicatorProps) {
  if (!isVisible) return null;

  const displayText = userNames && userNames.length > 0 
    ? `${userNames.join(', ')} ${userNames.length === 1 ? 'is' : 'are'} typing...`
    : 'Someone is typing...';

  return (
    <div className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1 bg-typing-bg rounded-full px-3 py-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-typing-dot rounded-full typing-dots" />
          <div className="w-2 h-2 bg-typing-dot rounded-full typing-dots" />
          <div className="w-2 h-2 bg-typing-dot rounded-full typing-dots" />
        </div>
        <span className="ml-2 text-xs">{displayText}</span>
      </div>
    </div>
  );
}