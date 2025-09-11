export const formatTimestamp = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isBookingComplete = (message: ChatMessage): boolean => {
  const completionIndicators = [
    "thank you for your confirmation",
    "confirmation mail soon",
    "appointment confirmed",
    "booking complete",
  ];

  return completionIndicators.some((indicator) => message.content.toLowerCase().includes(indicator));
};

export const extractBookingData = (): BookingData | null => {
  return null;
};

export const shouldShowTypingIndicator = (messages: ChatMessage[]): boolean => {
  const lastMessage = messages[messages.length - 1];
  return lastMessage?.isTyping === true;
};

export const getMessageSenderName = (sender: "user" | "bot"): string => {
  return sender === "user" ? "You" : "Glow & Grace Salon";
};

export const getMessageSenderAvatar = (sender: "user" | "bot"): string => {
  return sender === "user" ? "👤" : "💇‍♀️";
};

export const formatMessageContent = (content: string): string => {
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
};
