import { ChatHeader } from "./chat-header";
import { MessageInput } from "./message-input";
import { MessageList } from "./message-list";
import LadyIcon from "../../assets/img/lady.png";

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
    <div className="grid grid-cols-12 h-screen bg-background lg:p-5 p-3 lg:gap-5 gap-3">
      <div className="lg:col-span-9 md:col-span-8 col-span-12 flex h-full w-full flex-1 flex-col overflow-hidden rounded-2xl border-x border-b border-gray-200 ">
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
      <div className="lg:col-span-3 md:col-span-4 hidden md:block bg-gradient-to-b from-gray-900 to-green-300 rounded-2xl relative">
        <div className="absolute top-0 right-0 w-full h-full flex flex-col items-start justify-start gap-5">
          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
            <span className="text-3xl font-bold text-white">Glam-Mate</span>
            <span className="text-white">Beauty Salon Manager Agent</span>
          </div>
          <img src={LadyIcon} alt="logo" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};
