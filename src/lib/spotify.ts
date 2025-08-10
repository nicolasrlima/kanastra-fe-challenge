import axios, { type AxiosRequestConfig } from "axios";

const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

let accessToken: string | null = null;
let tokenExpiresAt: number | null = null;

async function fetchAccessToken() {
  if (
    accessToken &&
    tokenExpiresAt &&
    Date.now() < tokenExpiresAt - 60 * 1000 // refresh 1 min before expiry
  ) {
    return accessToken;
  }
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  const res = await axios.post(SPOTIFY_TOKEN_URL, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
    },
  });
  accessToken = res.data.access_token;
  tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
  return accessToken;
}

export async function spotifyApiRequest<T = unknown>(
  endpoint: string,
  options: Omit<AxiosRequestConfig, "url" | "headers"> = {}
): Promise<T> {
  const token = await fetchAccessToken();
  const res = await axios({
    url: `${SPOTIFY_API_BASE}${endpoint}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
  return res.data;
}
