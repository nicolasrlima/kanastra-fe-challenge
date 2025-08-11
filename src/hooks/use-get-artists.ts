import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  genres: string[];
}

export interface SpotifyArtistsResponse {
  artists: {
    items: SpotifyArtist[];
    total: number;
    limit: number;
    offset: number;
  };
}

export function useGetArtists({
  query,
  page,
  pageSize,
}: {
  query: string;
  page: number;
  pageSize: number;
}) {
  const shouldFetch = query?.length > 0;
  return useQuery<SpotifyArtistsResponse, Error>({
    queryKey: ["artists", page, query],
    queryFn: async () =>
      spotifyApiRequest<SpotifyArtistsResponse>(
        `/search?q=${encodeURIComponent(query)}&type=artist&limit=${pageSize}&offset=${(page - 1) * pageSize}`
      ),
    enabled: shouldFetch,
  });
}
