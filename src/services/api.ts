import { API_CONFIG } from "@/lib/constants";

export class ChatAPI {
  private static async makeRequest(
    url: string,
    data: N8nWebhookRequest,
    timeout: number = API_CONFIG.REQUEST_TIMEOUT,
  ): Promise<N8nWebhookResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
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
          throw new Error("Request timeout - please try again");
        }
        throw new Error(`Network error: ${error.message}`);
      }

      throw new Error("An unexpected error occurred");
    }
  }

  static async sendMessage(message: string): Promise<N8nWebhookResponse> {
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
