import { createFileRoute } from "@tanstack/react-router";
import { ArtistsTable } from "@/components/artists-table";

export const Route = createFileRoute("/")({
  component: Home,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: typeof search.q === "string" ? search.q : "",
      page: search.page ? Number(search.page) : 1,
    };
  },
});

function Home() {
  return <ArtistsTable />;
}
