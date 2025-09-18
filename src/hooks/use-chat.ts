import { useCallback, useState } from "react";
import { ChatAPI } from "../services/api";

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    isConnected: true,
  });

  const addMessage = useCallback((content: string, sender: "user" | "bot", isTyping: boolean = false) => {
    const generateMessageId = (): string => {
      return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    };

    const newMessage: ChatMessage = {
      id: generateMessageId(),
      content,
      sender,
      timestamp: new Date(),
      isTyping,
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage.id;
  }, []);

  const updateMessage = useCallback((messageId: string, content: string, isTyping: boolean = false) => {
    setChatState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => (msg.id === messageId ? { ...msg, content, isTyping } : msg)),
    }));
  }, []);

  const removeTypingIndicator = useCallback((messageId: string) => {
    setChatState((prev) => ({
      ...prev,
      messages: prev.messages.filter((msg) => msg.id !== messageId),
    }));
  }, []);

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!content.trim()) return;

      addMessage(content, "user");

      const typingId = addMessage("Processing your request...", "bot", true);

      setChatState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      const timeoutWarning = setTimeout(() => {
        updateMessage(typingId, "This is taking longer than usual... Please wait while we process your request.", true);
      }, 15000);

      try {
        const response = await ChatAPI.sendMessage(content);

        clearTimeout(timeoutWarning);
        removeTypingIndicator(typingId);
        addMessage(response.output.message, "bot");

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          isConnected: true,
        }));
      } catch (error) {
        clearTimeout(timeoutWarning);
        removeTypingIndicator(typingId);

        const errorMessage = error instanceof Error ? error.message : "Failed to send message";
        addMessage(`Error: ${errorMessage}`, "bot");

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isConnected: false,
        }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addMessage, removeTypingIndicator],
  );

  const clearMessages = useCallback(() => {
    setChatState((prev) => ({
      ...prev,
      messages: [],
      error: null,
    }));
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const isConnected = await ChatAPI.testConnection();
      setChatState((prev) => ({
        ...prev,
        isConnected,
      }));
      return isConnected;
    } catch {
      setChatState((prev) => ({
        ...prev,
        isConnected: true,
      }));
      return true;
    }
  }, []);

  return {
    ...chatState,
    sendMessage,
    clearMessages,
    testConnection,
    addMessage,
    updateMessage,
  };
};
