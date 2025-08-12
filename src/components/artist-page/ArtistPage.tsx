import { useSearch, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useGetArtist } from "@/hooks/use-get-artist";
import { useGetArtistTopTracks } from "@/hooks/use-get-artist-top-tracks";
import { useGetArtistAlbums } from "@/hooks/use-get-artist-albums";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 20;

export function ArtistPage() {
  const { t } = useTranslation();
  const search = useSearch({ from: "/artist" });
  const navigate = useNavigate({ from: "/artist" });
  const artistId = search.artistId;
  const albumPage = search.albumPage || 1;
  const albumQuery = search.albumQuery || "";
  const [albumSearchInput, setAlbumSearchInput] = useState(albumQuery);

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

  const { data: artist, isLoading: loadingArtist } = useGetArtist(artistId);
  const { data: topTracks, isLoading: loadingTracks } =
    useGetArtistTopTracks(artistId);
  const { data: albums, isLoading: loadingAlbums } = useGetArtistAlbums({
    artistId,
    albumPage,
    albumQuery,
    pageSize: PAGE_SIZE,
  });

  if (!artistId)
    return <div className="p-8 text-center">{t("no_artist_selected")}</div>;

  if (loadingArtist)
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-lg text-muted-foreground font-medium">
          {t("loading_artist")}
        </div>
      </div>
    );

  if (!artist)
    return <div className="p-8 text-center">{t("artist_not_found")}</div>;

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
            {t("popularity")}: {artist.popularity}
          </div>
          <div className="text-muted-foreground">
            {t("genres")}: {artist.genres?.join(", ")}
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-2">{t("top_tracks")}</h2>
      {loadingTracks ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2" />
          <div className="text-muted-foreground">{t("loading_top_tracks")}</div>
        </div>
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
      <h2 className="text-xl font-semibold mt-8 mb-2">{t("albums")}</h2>
      <form
        className="mb-4 flex gap-2 justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="text"
          value={albumSearchInput}
          onChange={(e) => setAlbumSearchInput(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-64"
        />
      </form>
      {loadingAlbums ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2" />
          <div className="text-muted-foreground">{t("loading_albums")}</div>
        </div>
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
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    navigate({
                      search: {
                        ...search,
                        albumPage: Math.max(1, albumPage - 1),
                      },
                    })
                  }
                  aria-disabled={albumPage === 1}
                  tabIndex={albumPage === 1 ? -1 : 0}
                >
                  {t("previous")}
                </PaginationPrevious>
              </PaginationItem>
              {Array.from(
                {
                  length: Math.max(
                    1,
                    Math.ceil((albums?.total ?? 0) / PAGE_SIZE)
                  ),
                },
                (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink
                      isActive={albumPage === i + 1}
                      onClick={() =>
                        navigate({
                          search: { ...search, albumPage: i + 1 },
                        })
                      }
                      href="#"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    navigate({
                      search: { ...search, albumPage: albumPage + 1 },
                    })
                  }
                  aria-disabled={albums?.items?.length !== PAGE_SIZE}
                  tabIndex={albums?.items?.length !== PAGE_SIZE ? -1 : 0}
                >
                  {t("next")}
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
