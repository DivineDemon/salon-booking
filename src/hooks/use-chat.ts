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

      const typingId = addMessage("", "bot", true);

      setChatState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await ChatAPI.sendMessage(content);

        removeTypingIndicator(typingId);
        addMessage(response.output.message, "bot");

        setChatState((prev) => ({
          ...prev,
          isLoading: false,
          isConnected: true,
        }));
      } catch (error) {
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
