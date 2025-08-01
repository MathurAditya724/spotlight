import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MessageBuffer } from "./messageBuffer.js";
import type { Payload } from "./utils.js";

export function createMcpInstance(buffer: MessageBuffer<Payload>) {
  const mcp = new McpServer({
    name: "spotlight-mcp",
    version: "0.0.1",
  });

  const errorsBuffer = new MessageBuffer<Payload>(10);
  buffer.subscribe((item: Payload) => {
    errorsBuffer.put(item);
  });

  mcp.tool(
    "get_errors",
    "Fetches the most recent errors from Spotlight debugger. Returns error details, stack traces, and request details for immediate debugging context.",
    async () => {
      const envelopes = errorsBuffer.read();
      errorsBuffer.clear();

      if (envelopes.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: "No recent errors found in Spotlight. This might be because the application started successfully, but runtime issues only appear when you interact with specific pages or features.\n\nAsk the user to navigate to the page where they're experiencing the issue to reproduce it, that way we can get that in the Spotlight debugger. So if you want to check for errors again, just ask me to do that.",
            },
          ],
        };
      }

      const errors = [];

      for (const [_contentType, data] of envelopes) {
        const text = data.toString("utf-8");
        const [_, { type }, payload] = JSON.parse(`[${text.replaceAll("}\n{", "},{")}]`) as any[];

        if (type === "event") {
          errors.push({
            exception: payload.exception,
            level: payload.level,
            request: payload.request,
          });
        }
      }

      return {
        content: errors.map(error => ({
          type: "text",
          text: JSON.stringify(error),
        })),
      };
    },
  );

  // TODO: Add tool for performance tracing
  // TODO: Add tool for profiling data

  return mcp;
}
