import { createFileRoute } from "@tanstack/react-router";
import { ArtistPage } from "@/components/ArtistPage";

export const Route = createFileRoute("/artist")({
  validateSearch: (search) => {
    return {
      artistId: typeof search.artistId === "string" ? search.artistId : "",
      albumPage: search.albumPage ? Number(search.albumPage) : 1,
      albumQuery:
        typeof search.albumQuery === "string" ? search.albumQuery : "",
    };
  },
  component: ArtistPage,
});
