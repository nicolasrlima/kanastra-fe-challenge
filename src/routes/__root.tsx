import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: function RootComponent() {
    const { i18n } = useTranslation();
    return (
      <QueryClientProvider client={queryClient}>
        <header className="w-full max-w-5xl mx-auto flex justify-end items-center p-4 border-b mb-4">
          <label htmlFor="lang-select" className="mr-2 font-medium">
            🌐
          </label>
          <Select
            defaultValue={i18n.language}
            onValueChange={i18n.changeLanguage}
          >
            <SelectTrigger id="lang-select" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>
        </header>
        <main className="w-full max-w-5xl mx-auto px-2">
          <Outlet />
        </main>
        <TanStackRouterDevtools />
      </QueryClientProvider>
    );
  },
});
