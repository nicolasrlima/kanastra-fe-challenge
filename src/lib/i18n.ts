import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Type-safe translation keys
export const resources = {
  en: {
    translation: {
      search_placeholder: "Search for an artist...",
      type_to_search: "Type an artist name to search.",
      loading_artists: "Loading artists...",
      error_loading_artists: "Error loading artists.",
      no_artists_found: "No artists found.",
      popularity: "Popularity",
      genres: "Genres",
      top_tracks: "Top Tracks",
      albums: "Albums",
      loading_artist: "Loading artist...",
      artist_not_found: "Artist not found.",
      no_artist_selected: "No artist selected.",
      loading_top_tracks: "Loading top tracks...",
      loading_albums: "Loading albums...",
      no_top_tracks: "No top tracks found.",
      no_albums: "No albums found.",
      previous: "Previous",
      next: "Next",
    },
  },
  pt: {
    translation: {
      search_placeholder: "Buscar por um artista...",
      type_to_search: "Digite o nome de um artista para buscar.",
      loading_artists: "Carregando artistas...",
      error_loading_artists: "Erro ao carregar artistas.",
      no_artists_found: "Nenhum artista encontrado.",
      popularity: "Popularidade",
      genres: "Gêneros",
      top_tracks: "Músicas mais populares",
      albums: "Álbuns",
      loading_artist: "Carregando artista...",
      artist_not_found: "Artista não encontrado.",
      no_artist_selected: "Nenhum artista selecionado.",
      loading_top_tracks: "Carregando músicas...",
      loading_albums: "Carregando álbuns...",
      no_top_tracks: "Nenhuma música encontrada.",
      no_albums: "Nenhum álbum encontrado.",
      previous: "Anterior",
      next: "Próximo",
    },
  },
} as const;

export type AppLanguages = keyof typeof resources;

export type TranslationKeys = keyof typeof resources.en.translation;

// i18n initialization
void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  supportedLngs: ["en", "pt"],
});

export default i18n;
