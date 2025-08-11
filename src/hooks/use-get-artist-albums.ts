import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
}
export interface SpotifyAlbumsResponse {
  items: SpotifyAlbum[];
  total: number;
}

export function useGetArtistAlbums({
  artistId,
  albumPage,
  albumQuery,
  pageSize,
}: {
  artistId: string | undefined;
  albumPage: number;
  albumQuery: string;
  pageSize: number;
}) {
  return useQuery<SpotifyAlbumsResponse | null>({
    queryKey: ["artist-albums", artistId, albumPage, albumQuery],
    queryFn: async () => {
      if (!artistId) return null;
      const allAlbums = await spotifyApiRequest<SpotifyAlbumsResponse>(
        `/artists/${artistId}/albums?limit=${pageSize}&offset=${(albumPage - 1) * pageSize}`
      );
      if (!albumQuery) return allAlbums;
      const filtered = {
        ...allAlbums,
        items: allAlbums.items.filter((album: SpotifyAlbum) =>
          album.name.toLowerCase().includes(albumQuery.toLowerCase())
        ),
        total: allAlbums.items.filter((album: SpotifyAlbum) =>
          album.name.toLowerCase().includes(albumQuery.toLowerCase())
        ).length,
      };
      return filtered;
    },
    enabled: !!artistId,
  });
}
