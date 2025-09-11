declare type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isTyping?: boolean;
};

declare type N8nWebhookRequest = {
  message: string;
};

declare type N8nWebhookResponse = {
  output: {
    is_pass_next: boolean;
    message: string;
  };
};

declare type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
};

declare type BookingData = {
  customer_name: string;
  email: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  service_type: string;
  preferred_stylist?: string;
  special_notes?: string;
};
