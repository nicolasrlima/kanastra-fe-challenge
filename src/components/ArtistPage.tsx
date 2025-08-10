import { useSearch, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";
import { useState, useEffect } from "react";

const PAGE_SIZE = 20;

// Types for Spotify API responses
interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  genres: string[];
}
interface SpotifyTrack {
  id: string;
  name: string;
  album: { name: string };
}
interface SpotifyTopTracksResponse {
  tracks: SpotifyTrack[];
}
interface SpotifyAlbum {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
}
interface SpotifyAlbumsResponse {
  items: SpotifyAlbum[];
  total: number;
}

export function ArtistPage() {
  const search = useSearch({ from: "/artist" });
  const navigate = useNavigate({ from: "/artist" });
  const artistId = search.artistId;
  const albumPage = search.albumPage || 1;
  const albumQuery = search.albumQuery || "";
  const [albumSearchInput, setAlbumSearchInput] = useState(albumQuery);

  // Debounce album search input and update search params
  useEffect(() => {
    if (albumSearchInput !== albumQuery) {
      const handler = setTimeout(() => {
        navigate({
          search: { ...search, albumQuery: albumSearchInput, albumPage: 1 },
        });
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [albumSearchInput, albumQuery, search, navigate]);

  // Fetch artist details
  const { data: artist, isLoading: loadingArtist } =
    useQuery<SpotifyArtist | null>({
      queryKey: ["artist", artistId],
      queryFn: async () => {
        if (!artistId) return null;
        return spotifyApiRequest<SpotifyArtist>(`/artists/${artistId}`);
      },
      enabled: !!artistId,
    });

  // Fetch top tracks
  const { data: topTracks, isLoading: loadingTracks } =
    useQuery<SpotifyTopTracksResponse | null>({
      queryKey: ["artist-top-tracks", artistId],
      queryFn: async () => {
        if (!artistId) return null;
        return spotifyApiRequest<SpotifyTopTracksResponse>(
          `/artists/${artistId}/top-tracks?market=US`
        );
      },
      enabled: !!artistId,
    });

  // Fetch albums (paginated, with search)
  const { data: albums, isLoading: loadingAlbums } =
    useQuery<SpotifyAlbumsResponse | null>({
      queryKey: ["artist-albums", artistId, albumPage, albumQuery],
      queryFn: async () => {
        if (!artistId) return null;
        // Spotify's /albums endpoint does not support q param, so filter client-side
        const allAlbums = await spotifyApiRequest<SpotifyAlbumsResponse>(
          `/artists/${artistId}/albums?limit=${PAGE_SIZE}&offset=${
            (albumPage - 1) * PAGE_SIZE
          }`
        );
        if (!albumQuery) return allAlbums;
        const filtered = {
          ...allAlbums,
          items: allAlbums.items.filter((album) =>
            album.name.toLowerCase().includes(albumQuery.toLowerCase())
          ),
          total: allAlbums.items.filter((album) =>
            album.name.toLowerCase().includes(albumQuery.toLowerCase())
          ).length,
        };
        return filtered;
      },
      enabled: !!artistId,
    });

  if (!artistId)
    return <div className="p-8 text-center">No artist selected.</div>;
  if (loadingArtist)
    return <div className="p-8 text-center">Loading artist...</div>;
  if (!artist) return <div className="p-8 text-center">Artist not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-6">
        {artist.images?.[0]?.url && (
          <img
            src={artist.images[0].url}
            alt={artist.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
          <div className="text-muted-foreground mb-1">
            Popularity: {artist.popularity}
          </div>
          <div className="text-muted-foreground">
            Genres: {artist.genres?.join(", ")}
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">Top Tracks</h2>
      {loadingTracks ? (
        <div>Loading top tracks...</div>
      ) : (
        <ol className="list-decimal ml-6">
          {topTracks?.tracks?.slice(0, 10).map((track) => (
            <li key={track.id} className="mb-1">
              {track.name}{" "}
              <span className="text-muted-foreground">
                ({track.album.name})
              </span>
            </li>
          ))}
        </ol>
      )}
      <h2 className="text-xl font-semibold mt-8 mb-2">Albums</h2>
      <form
        className="mb-4 flex gap-2 justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          value={albumSearchInput}
          onChange={(e) => setAlbumSearchInput(e.target.value)}
          placeholder="Search albums..."
          className="border rounded px-3 py-2 w-64"
        />
      </form>
      {loadingAlbums ? (
        <div>Loading albums...</div>
      ) : (
        <div>
          <ul className="mb-4">
            {albums?.items?.map((album) => (
              <li key={album.id} className="mb-2 flex items-center gap-3">
                {album.images?.[0]?.url && (
                  <img
                    src={album.images[0].url}
                    alt={album.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{album.name}</div>
                  <div className="text-muted-foreground text-sm">
                    {album.release_date}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 justify-center items-center">
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={albumPage === 1}
              onClick={() =>
                navigate({ search: { ...search, albumPage: albumPage - 1 } })
              }
            >
              Previous
            </button>
            {/* Numbered pagination */}
            {Array.from(
              {
                length: Math.max(
                  1,
                  Math.ceil((albums?.total ?? 0) / PAGE_SIZE)
                ),
              },
              (_, i) => (
                <button
                  key={i + 1}
                  className={`px-3 py-1 rounded border ${
                    albumPage === i + 1
                      ? "bg-accent text-accent-foreground font-bold"
                      : ""
                  }`}
                  onClick={() =>
                    navigate({ search: { ...search, albumPage: i + 1 } })
                  }
                  disabled={albumPage === i + 1}
                >
                  {i + 1}
                </button>
              )
            )}
            <button
              className="px-3 py-1 rounded border disabled:opacity-50"
              disabled={albums?.items?.length !== PAGE_SIZE}
              onClick={() =>
                navigate({ search: { ...search, albumPage: albumPage + 1 } })
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
