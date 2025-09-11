import { useEffect } from "react";
import { ChatContainer } from "./components/chat/chat-container";
import { useChat } from "./hooks/use-chat";

const App = () => {
  const { messages, isLoading, isConnected, error, sendMessage, clearMessages, testConnection } = useChat();

  useEffect(() => {
    sendMessage("Hey");
  }, [sendMessage]);

  return (
    <ChatContainer
      messages={messages}
      isLoading={isLoading}
      isConnected={isConnected}
      error={error}
      onSendMessage={sendMessage}
      onClearChat={clearMessages}
      onTestConnection={testConnection}
    />
  );
};

export default App;
