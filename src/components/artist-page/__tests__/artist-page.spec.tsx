import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ArtistPage } from "../ArtistPage";
import { useGetArtist } from "@/hooks/use-get-artist";
import { useGetArtistTopTracks } from "@/hooks/use-get-artist-top-tracks";
import { useGetArtistAlbums } from "@/hooks/use-get-artist-albums";

const mockArtist = {
  id: "1",
  name: "Test Artist",
  images: [{ url: "test.jpg" }],
  popularity: 80,
  genres: ["pop", "rock"],
};
const mockTopTracks = {
  tracks: [
    { id: "t1", name: "Song 1", album: { name: "Album 1" } },
    { id: "t2", name: "Song 2", album: { name: "Album 2" } },
  ],
};
const mockAlbums = {
  items: [
    {
      id: "a1",
      name: "Album 1",
      images: [{ url: "a1.jpg" }],
      release_date: "2020-01-01",
    },
  ],
  total: 1,
};

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
  }),
  useQuery: vi.fn(),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@tanstack/react-router", () => ({
  useSearch: () => ({ artistId: "1", albumPage: 1, albumQuery: "" }),
  useNavigate: () => vi.fn(),
}));

vi.mock("@/hooks/use-get-artist");
vi.mock("@/hooks/use-get-artist-top-tracks");
vi.mock("@/hooks/use-get-artist-albums");

function mockArtistQuery({
  data = mockArtist,
  isLoading = false,
  isError = false,
  isSuccess = !isLoading && !isError,
  ...rest
}: Partial<ReturnType<typeof useGetArtist>> = {}) {
  vi.mocked(useGetArtist).mockReturnValue({
    data,
    isLoading,
    isError,
    isSuccess,
    status: isLoading ? "pending" : isError ? "error" : "success",
    isFetched: !isLoading,
    isPending: isLoading,
    isLoadingError: false,
    error: null,
    refetch: vi.fn(),
    isRefetching: false,
    isPlaceholderData: false,
    isStale: false,
    isPaused: false,
    isFetching: isLoading,
    failureCount: 0,
    ...rest,
  } as ReturnType<typeof useGetArtist>);
}

function mockTopTracksQuery({
  data = mockTopTracks,
  isLoading = false,
  isError = false,
  isSuccess = !isLoading && !isError,
  ...rest
}: Partial<ReturnType<typeof useGetArtistTopTracks>> = {}) {
  vi.mocked(useGetArtistTopTracks).mockReturnValue({
    data,
    isLoading,
    isError,
    isSuccess,
    status: isLoading ? "pending" : isError ? "error" : "success",
    isFetched: !isLoading,
    isPending: isLoading,
    isLoadingError: false,
    error: null,
    refetch: vi.fn(),
    isRefetching: false,
    isPlaceholderData: false,
    isStale: false,
    isPaused: false,
    isFetching: isLoading,
    failureCount: 0,
    ...rest,
  } as ReturnType<typeof useGetArtistTopTracks>);
}

function mockAlbumsQuery({
  data = mockAlbums,
  isLoading = false,
  isError = false,
  isSuccess = !isLoading && !isError,
  ...rest
}: Partial<ReturnType<typeof useGetArtistAlbums>> = {}) {
  vi.mocked(useGetArtistAlbums).mockReturnValue({
    data,
    isLoading,
    isError,
    isSuccess,
    status: isLoading ? "pending" : isError ? "error" : "success",
    isFetched: !isLoading,
    isPending: isLoading,
    isLoadingError: false,
    error: null,
    refetch: vi.fn(),
    isRefetching: false,
    isPlaceholderData: false,
    isStale: false,
    isPaused: false,
    isFetching: isLoading,
    failureCount: 0,
    ...rest,
  } as ReturnType<typeof useGetArtistAlbums>);
}

describe("ArtistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  it("renders artist info, top tracks, and albums", () => {
    mockArtistQuery();
    mockTopTracksQuery();
    mockAlbumsQuery();
    render(<ArtistPage />);
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
    expect(screen.getByText("Popularity: 80")).toBeInTheDocument();
    expect(screen.getByText("Genres: pop, rock")).toBeInTheDocument();
    expect(screen.getByText("Song 1")).toBeInTheDocument();
    expect(screen.getByText("Song 2")).toBeInTheDocument();
    expect(screen.getByText("Album 1")).toBeInTheDocument();
  });

  it("shows loading state for artist", () => {
    mockArtistQuery({ data: undefined, isLoading: true });
    mockTopTracksQuery({ data: undefined });
    mockAlbumsQuery({ data: undefined });
    render(<ArtistPage />);
    expect(screen.getByText(/loading artist/i)).toBeInTheDocument();
  });

  it("shows not found if artist is missing", () => {
    mockArtistQuery({ data: null });
    mockTopTracksQuery({ data: undefined });
    mockAlbumsQuery({ data: undefined });
    render(<ArtistPage />);
    expect(screen.getByText(/artist not found/i)).toBeInTheDocument();
  });

  it("shows loading state for top tracks", () => {
    mockArtistQuery();
    mockTopTracksQuery({ data: undefined, isLoading: true });
    mockAlbumsQuery({ data: undefined });
    render(<ArtistPage />);
    expect(screen.getByText(/loading top tracks/i)).toBeInTheDocument();
  });

  it("shows loading state for albums", () => {
    mockArtistQuery();
    mockTopTracksQuery();
    mockAlbumsQuery({ data: undefined, isLoading: true });
    render(<ArtistPage />);
    expect(screen.getByText(/loading albums/i)).toBeInTheDocument();
  });
});
