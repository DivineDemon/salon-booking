import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
  onTestConnection: () => void;
}

export const ChatContainer = ({
  messages,
  isLoading,
  isConnected,
  error,
  onSendMessage,
  onClearChat,
  onTestConnection,
}: ChatContainerProps) => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="mx-auto flex h-screen w-full max-w-4xl flex-1 flex-col overflow-hidden">
        <ChatHeader isConnected={isConnected} onClearChat={onClearChat} onTestConnection={onTestConnection} />
        {error && (
          <div className="border-destructive border-l-4 bg-destructive/10 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-destructive text-sm">
                  <strong>Error:</strong> {error}
                </p>
              </div>
            </div>
          </div>
        )}
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};
