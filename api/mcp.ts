import { createStorybookMcpHandler, type StorybookContext } from '@storybook/mcp';

/**
 * Reads one Storybook manifest from the origin of the incoming request, so this
 * function serves the manifest that Vercel deploys as static files next to it and
 * never depends on `storybook-static/` being traced into the function bundle.
 *
 * The default provider also resolves against the request origin, but reports a
 * network failure as a bare `fetch failed`; this one names the URL it tried.
 */
async function fetchManifestFromOrigin(
  request: StorybookContext['request'],
  path: string,
): Promise<string> {
  const filename = path.replace(/^\.\//, '');

  if (!request) {
    throw new Error(`Cannot read ${filename}: the MCP context carries no request, so the origin is unknown.`);
  }

  const url = new URL(`/${filename}`, request.url).toString();
  let response: Response;

  try {
    response = await fetch(url);
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Cannot read Storybook manifest ${url}: ${reason}`);
  }

  if (!response.ok) {
    throw new Error(`Cannot read Storybook manifest ${url}: HTTP ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new Error(`Cannot read Storybook manifest ${url}: expected application/json, got ${contentType}`);
  }

  return response.text();
}

/**
 * Storybook MCP endpoint (docs toolset only) for the deployed static Storybook.
 *
 * `createStorybookMcpHandler` returns a fetch-compatible handler
 * `(request: Request) => Promise<Response>` speaking the MCP Streamable HTTP
 * transport, so this Vercel function is a pass-through: it forwards the incoming
 * request untouched and returns the transport response as-is, including
 * `text/event-stream` bodies.
 *
 * The `{ fetch }` object export is required: `@vercel/node` only bridges a
 * module to Web `Request`/`Response` for object exports (`fetch` or HTTP method
 * keys). A default-exported function is called as Node-style `(req, res)`.
 *
 * Created once per instance and reused across invocations to keep cold starts cheap.
 */
const handler = createStorybookMcpHandler({ manifestProvider: fetchManifestFromOrigin });

export default {
  async fetch(request: Request): Promise<Response> {
    return (await handler)(request);
  },
};
