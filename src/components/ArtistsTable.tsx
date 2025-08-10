import { useQuery } from "@tanstack/react-query";
import { spotifyApiRequest } from "@/lib/spotify";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useCallback, useEffect, useState } from "react";

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  popularity: number;
  genres: string[];
}

interface SpotifyArtistsResponse {
  artists: {
    items: Artist[];
    total: number;
    limit: number;
    offset: number;
  };
}

const PAGE_SIZE = 20;

export function ArtistsTable() {
  const search = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const page = search.page;
  const query = search.q;
  const [searchInput, setSearchInput] = useState(query);

  const setSearchParams = useCallback(
    (params: Partial<typeof search>) => {
      const newParams = { ...search, ...params };
      Object.keys(newParams).forEach((k) => {
        const key = k as keyof typeof newParams;
        if (newParams[key] === undefined || newParams[key] === "") {
          delete newParams[key];
        }
      });
      navigate({ search: newParams });
    },
    [navigate, search]
  );

  useEffect(() => {
    if (searchInput !== query) {
      const handler = setTimeout(() => {
        setSearchParams({ q: searchInput, page: 1 });
      }, 400);
      return () => clearTimeout(handler);
    }
  }, [searchInput, query, setSearchParams]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage });
  };

  const shouldFetch = query?.length > 0;
  const { data, isLoading, error } = useQuery<SpotifyArtistsResponse, Error>({
    queryKey: ["artists", page, query],
    queryFn: async () =>
      spotifyApiRequest<SpotifyArtistsResponse>(
        `/search?q=${encodeURIComponent(
          query
        )}&type=artist&limit=${PAGE_SIZE}&offset=${(page - 1) * PAGE_SIZE}`
      ),
    enabled: shouldFetch,
  });

  let content;
  if (!shouldFetch) {
    content = (
      <div className="text-center text-muted-foreground py-8">
        Type an artist name to search.
      </div>
    );
  } else if (isLoading) {
    content = (
      <div className="flex flex-col items-center justify-center py-16 min-h-[200px]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-lg text-muted-foreground font-medium">
          Loading artists...
        </div>
      </div>
    );
  } else if (error) {
    content = <div>Error loading artists.</div>;
  } else if ((data?.artists?.items?.length ?? 0) === 0) {
    content = (
      <div className="text-center text-muted-foreground py-8">
        No artists found.
      </div>
    );
  } else {
    const artists = data?.artists?.items ?? [];
    const total = data?.artists?.total ?? 0;
    const pageCount = Math.ceil(total / PAGE_SIZE);
    content = (
      <>
        <Table>
          <TableCaption>Artists</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Popularity</TableHead>
              <TableHead>Genres</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.map((artist: Artist) => (
              <TableRow
                key={artist.id}
                className="cursor-pointer hover:bg-accent"
                onClick={() =>
                  navigate({
                    to: "/artist",
                    search: {
                      artistId: artist.id,
                      albumPage: 1,
                      albumQuery: "",
                    },
                  })
                }
              >
                <TableCell>
                  {artist.images[0] && (
                    <img
                      src={artist.images[0].url}
                      alt={artist.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </TableCell>
                <TableCell>{artist.name}</TableCell>
                <TableCell>{artist.popularity}</TableCell>
                <TableCell>{artist.genres?.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  href="#"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pageCount, page + 1))}
                aria-disabled={page === pageCount}
                tabIndex={page === pageCount ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </>
    );
  }

  return (
    <>
      <form
        className="mb-4 flex gap-2 justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for an artist..."
          className="border rounded px-3 py-2 w-64"
        />
      </form>
      {content}
    </>
  );
}
