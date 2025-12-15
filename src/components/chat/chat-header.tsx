import { RotateCcw, Wifi, WifiOff } from "lucide-react";
import { Button } from "../ui/button";

interface ChatHeaderProps {
  isConnected: boolean;
  onClearChat: () => void;
  onTestConnection: () => void;
}

export const ChatHeader = ({ isConnected, onClearChat, onTestConnection }: ChatHeaderProps) => {
  return (
    <div className="border-b bg-gradient-to-b from-gray-800 to-green-300 p-4 text-primary-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20">
            <span className="text-2xl">💇‍♀️</span>
          </div>
          <div>
            <h1 className="font-semibold text-lg">Glam-Mate Salon</h1>
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTestConnection}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Test Connection"
          >
            <Wifi className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearChat}
            className="text-primary-foreground hover:bg-primary-foreground/20"
            title="Clear Chat"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
