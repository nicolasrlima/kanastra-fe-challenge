import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  genres: string[];
}

export function useGetArtist(artistId: string | undefined) {
  return useQuery<SpotifyArtist | null>({
    queryKey: ["artist", artistId],
    queryFn: async () => {
      if (!artistId) return null;
      return spotifyApiRequest<SpotifyArtist>(`/artists/${artistId}`);
    },
    enabled: !!artistId,
  });
}
