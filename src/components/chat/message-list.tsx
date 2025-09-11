import { useCallback, useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";

interface MessageListProps {
  messages: ChatMessage[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-muted-foreground">
          <div className="mb-4 text-4xl">💇‍♀️</div>
          <h3 className="mb-2 font-medium text-lg">Welcome to Glow & Grace Salon</h3>
          <p className="text-sm">Start a conversation to book your appointment!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-186px)] flex-1 space-y-2 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
