import { formatTimestamp, getMessageSenderName } from "../../lib/chat-helpers";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.sender === "user";
  const isTyping = message.isTyping;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-center gap-2`}>
        {/* <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {getMessageSenderAvatar(message.sender)}
        </div> */}
        <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
          <div className={`mb-1 text-muted-foreground text-xs ${isUser ? "text-right" : "text-left"}`}>
            {getMessageSenderName(message.sender)}
          </div>

          <div
            className={`rounded-2xl ${isUser ? 'px-4  py-2':''}  ${
              isUser
                ? "rounded-br-none bg-primary text-primary-foreground"
                : "rounded-bl-md  text-muted-foreground"
            } ${isTyping ? "animate-pulse" : ""}`}
          >
            {isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            ) : (
              <div
                className="whitespace-pre-wrap wrap-break-word"
                dangerouslySetInnerHTML={{
                  __html: message.content.replace(/\n/g, "<br>"),
                }}
              />
            )}
          </div>
          <div className={`mt-1 text-muted-foreground text-xs ${isUser ? "text-right" : "text-left"}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};
