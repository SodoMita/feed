const SAFE_PROTOCOLS = new Set(["data:", "blob:", "about:"]);

type WindowWithOfflineFlag = Window & { __feedOfflineLockdown?: boolean };

const getUrlString = (input: string | URL | Request) => {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  if (typeof Request !== "undefined" && input instanceof Request) return input.url;
  return String(input);
};

const isAllowedUrl = (raw: string) => {
  if (!raw) return false;

  try {
    const url = new URL(raw, window.location.href);

    if (SAFE_PROTOCOLS.has(url.protocol)) return true;

    if (url.origin === window.location.origin) {
      return url.pathname === window.location.pathname || url.pathname === "/";
    }

    return false;
  } catch {
    return false;
  }
};

const block = (kind: string, url: string): never => {
  throw new Error(`[offline-lockdown] Blocked ${kind}: ${url}`);
};

export const enableOfflineLockdown = () => {
  if (typeof window === "undefined") return;

  const flaggedWindow = window as WindowWithOfflineFlag;
  if (flaggedWindow.__feedOfflineLockdown) return;
  flaggedWindow.__feedOfflineLockdown = true;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = getUrlString(input as string | URL | Request);
    if (!isAllowedUrl(url)) block("fetch", url);
    return nativeFetch(input, init);
  }) as typeof window.fetch;

  const nativeOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) {
    const target = String(url);
    if (!isAllowedUrl(target)) block("xhr", target);
    return nativeOpen.call(this, method, url, async ?? true, username ?? null, password ?? null);
  };

  const nativeSendBeacon = navigator.sendBeacon?.bind(navigator);
  if (nativeSendBeacon) {
    navigator.sendBeacon = ((url: string | URL, data?: BodyInit | null) => {
      const target = typeof url === "string" ? url : url.toString();
      if (!isAllowedUrl(target)) block("beacon", target);
      return nativeSendBeacon(url, data);
    }) as typeof navigator.sendBeacon;
  }

  if (typeof WebSocket !== "undefined") {
    const offlineWebSocket = function (this: unknown, url: string | URL) {
      const target = typeof url === "string" ? url : url.toString();
      block("websocket", target);
    } as unknown as typeof WebSocket;
    window.WebSocket = offlineWebSocket;
  }

  if (typeof EventSource !== "undefined") {
    const offlineEventSource = function (this: unknown, url: string | URL) {
      const target = typeof url === "string" ? url : url.toString();
      block("eventsource", target);
    } as unknown as typeof EventSource;
    window.EventSource = offlineEventSource;
  }

  if (typeof Worker !== "undefined") {
    const NativeWorker = Worker;
    const OfflineWorker = class extends NativeWorker {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        const target = typeof scriptURL === "string" ? scriptURL : scriptURL.toString();
        if (!isAllowedUrl(target)) block("worker", target);
        super(scriptURL, options);
      }
    };
    window.Worker = OfflineWorker as typeof Worker;
  }

  if (typeof SharedWorker !== "undefined") {
    const NativeSharedWorker = SharedWorker;
    const OfflineSharedWorker = class extends NativeSharedWorker {
      constructor(scriptURL: string | URL, options?: string | WorkerOptions) {
        const target = typeof scriptURL === "string" ? scriptURL : scriptURL.toString();
        if (!isAllowedUrl(target)) block("shared-worker", target);
        super(scriptURL, options);
      }
    };
    window.SharedWorker = OfflineSharedWorker as typeof SharedWorker;
  }
};
