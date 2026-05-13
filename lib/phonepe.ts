interface TokenCache {
  token: string;
  expiresAt: number; // unix seconds
}

let tokenCache: TokenCache | null = null;

function getUrls(env: string) {
  const isProd = env === "PROD";
  return {
    authUrl: isProd
      ? "https://api.phonepe.com/apis/identity-manager/v1/oauth/token"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
    pgBaseUrl: isProd
      ? "https://api.phonepe.com/apis/pg"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox",
  };
}

export function getPhonePeEnv() {
  return (process.env.NEXT_PUBLIC_PHONEPE_ENV ?? "UAT")
    .replace(/['"]/g, "")
    .trim()
    .toUpperCase();
}

export function getPhonePePgBaseUrl() {
  return getUrls(getPhonePeEnv()).pgBaseUrl;
}

export async function getPhonePeToken(): Promise<string> {
  const nowSeconds = Date.now() / 1000;

  // Reuse cached token if still valid with 60s buffer
  if (tokenCache && tokenCache.expiresAt - 60 > nowSeconds) {
    return tokenCache.token;
  }

  const env = getPhonePeEnv();
  const { authUrl } = getUrls(env);

  const clientId = (process.env.PHONEPE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.PHONEPE_CLIENT_SECRET || "").trim();
  const clientVersion = (process.env.PHONEPE_CLIENT_VERSION || "1").trim();

  if (!clientId || !clientSecret) {
    throw new Error("PhonePe credentials missing: PHONEPE_CLIENT_ID and PHONEPE_CLIENT_SECRET are required");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    client_version: clientVersion,
    grant_type: "client_credentials",
  });

  const res = await fetch(authUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PhonePe auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  tokenCache = {
    token: data.access_token,
    expiresAt: data.expires_at,
  };

  return data.access_token;
}
