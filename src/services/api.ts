import { API_CONFIG } from "@/lib/constants";

export class ChatAPI {
  private static sessionId: string = crypto.randomUUID();

  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static async makeRequest(
    url: string,
    data: N8nWebhookRequest,
    timeout: number = API_CONFIG.REQUEST_TIMEOUT,
    retryCount: number = 0,
  ): Promise<N8nWebhookResponseItem> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: data.message,
          current_date: new Date(),
          session_id: this.sessionId,
          business_id: API_CONFIG.BUSINESS_ID,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
      }

      const responseText = await response.text();

      if (!responseText.trim()) {
        throw new Error("Empty response from server");
      }

      try {
        const result = JSON.parse(responseText);

        if (Array.isArray(result) && result.length > 0) {
          const firstItem = result[0];
          if (firstItem.output && typeof firstItem.output.message === "string") {
            return firstItem;
          }
        }

        if (result.result && Array.isArray(result.result) && result.result.length > 0) {
          const firstResult = result.result[0];
          if (firstResult.output && typeof firstResult.output === "string") {
            return {
              output: {
                is_pass_next: false,
                message: firstResult.output,
              },
            };
          } else if (firstResult.output === "" || firstResult.output === null || firstResult.output === undefined) {
            return {
              output: {
                is_pass_next: true,
                message:
                  "Your booking has been finalized successfully, please find the booking details in your inbox shortly.",
              },
            };
          }
        }

        if (result.output && typeof result.output.message === "string") {
          return result;
        } else if (typeof result === "string") {
          return {
            output: {
              is_pass_next: false,
              message: result,
            },
          };
        } else if (result.message) {
          return {
            output: {
              is_pass_next: false,
              message: result.message,
            },
          };
        } else {
          return {
            output: {
              is_pass_next: false,
              message: "Received response but format was unexpected",
            },
          };
        }
      } catch (parseError) {
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}... ${parseError}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          if (retryCount < API_CONFIG.MAX_RETRIES) {
            await this.sleep(API_CONFIG.RETRY_DELAY * (retryCount + 1));
            return this.makeRequest(url, data, timeout, retryCount + 1);
          }
          throw new Error(
            "Request is taking longer than expected. The booking system might be processing your request - please wait a moment and try again if needed.",
          );
        }

        if (
          retryCount < API_CONFIG.MAX_RETRIES &&
          (error.message.includes("Network error") || error.message.includes("HTTP error"))
        ) {
          await this.sleep(API_CONFIG.RETRY_DELAY * (retryCount + 1));
          return this.makeRequest(url, data, timeout, retryCount + 1);
        }

        throw new Error(`Network error: ${error.message}`);
      }

      throw new Error("An unexpected error occurred");
    }
  }

  static async sendMessage(message: string): Promise<N8nWebhookResponseItem> {
    const requestData: N8nWebhookRequest = {
      message: message.trim(),
    };

    return this.makeRequest(API_CONFIG.WEBHOOK_URL, requestData);
  }

  static async testConnection(): Promise<boolean> {
    try {
      await this.sendMessage("Hello");
      return true;
    } catch {
      return false;
    }
  }
}
