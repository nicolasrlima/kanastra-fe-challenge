import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ArtistsTable } from "./components/ArtistsTable";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ArtistsTable />
    </QueryClientProvider>
  );
}

export default App;
