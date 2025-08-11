import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";

interface SpotifyTrack {
  id: string;
  name: string;
  album: { name: string };
}
export interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}

export function useGetArtistTopTracks(artistId: string | undefined) {
  return useQuery<SpotifyTopTracksResponse | null>({
    queryKey: ["artist-top-tracks", artistId],
    queryFn: async () => {
      if (!artistId) return null;
      return spotifyApiRequest<SpotifyTopTracksResponse>(
        `/artists/${artistId}/top-tracks?market=US`
      );
    },
    enabled: !!artistId,
  });
}
