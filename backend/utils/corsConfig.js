const DEFAULT_PROTOCOL = "https";

function getFirstHeaderValue(value) {
  if (Array.isArray(value)) return value[0] || "";
  return String(value || "").split(",")[0].trim();
}

export function parseOriginList(value = "") {
  return String(value)
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

export function getVercelOrigin(vercelUrl = "") {
  const host = String(vercelUrl).trim();
  return host ? `${DEFAULT_PROTOCOL}://${host}` : "";
}

export function getRequestOrigin(req) {
  const headers = req?.headers || {};
  const forwardedProto = getFirstHeaderValue(headers["x-forwarded-proto"]);
  const forwardedHost = getFirstHeaderValue(headers["x-forwarded-host"]);
  const proto = forwardedProto || req?.protocol || "http";
  const host = forwardedHost || getFirstHeaderValue(headers.host);

  return host ? `${proto}://${host}` : "";
}

export function createCorsOptionsDelegate({
  configuredOrigins = [],
  isProduction = false,
  vercelOrigin = "",
} = {}) {
  return (req, callback) => {
    const requestOrigin = getRequestOrigin(req);
    const allowedOrigins = new Set(configuredOrigins);
    const origin = req.headers.origin;

    if (vercelOrigin) allowedOrigins.add(vercelOrigin);
    if (requestOrigin) allowedOrigins.add(requestOrigin);

    if (!origin) {
      return callback(null, { origin: true, credentials: true });
    }

    const allowDevFallback = !isProduction && configuredOrigins.length === 0 && !vercelOrigin;
    if (allowDevFallback || allowedOrigins.has(origin)) {
      return callback(null, { origin: true, credentials: true });
    }

    const error = new Error(`Origin ${origin} ไม่ได้รับอนุญาต`);
    error.status = 403;
    error.code = "cors-origin-denied";
    return callback(error);
  };
}
