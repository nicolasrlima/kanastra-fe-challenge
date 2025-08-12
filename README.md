# Kanasta Frontend Challenge – Spotify Artist Explorer

## Deploy

- O projeto está hospedado pelo AWS Amplify. Acesse [https://main.d1zyarm2xgo6et.amplifyapp.com/) para ver a aplicação em produção.

## 🚀 Como rodar o projeto

1. **Pré-requisitos:**
   - Node.js >= 24
   - pnpm (ou npm/yarn)

2. **Instale as dependências:**

   ```sh
   pnpm install
   # ou
   npm install
   # ou
   yarn
   ```

3. **Inicie o servidor de desenvolvimento:**

   ```sh
   pnpm dev
   # ou
   npm run dev
   # ou
   yarn dev
   ```

4. **Acesse:**
   Abra [http://localhost:5173](http://localhost:5173) no navegador.

5. **Testes:**
   ```sh
   pnpm test
   # ou
   npm test
   # ou
   yarn test
   ```

## 🛠️ Stack e Ferramentas

- **React + TypeScript:** Base do frontend, com tipagem forte e componentes funcionais.
- **shadcn/ui:** Biblioteca de componentes UI acessíveis e modernos, utilizada para tabelas, inputs, selects e paginação.
- **TanStack Router:** Roteamento baseado em arquivos, com sincronização de parâmetros de busca e navegação fluida.
- **React Query:** Gerenciamento de cache e requisições assíncronas, garantindo performance e UX responsiva.
- **i18n (react-i18next):** Internacionalização com suporte a inglês e português, incluindo troca dinâmica de idioma.
- **Vitest + React Testing Library:** Testes unitários completos, com mocks para hooks de dados e cobertura de 100% dos principais fluxos.
- **Spotify Web API:** Integração para busca de artistas, álbuns e faixas.

## ✨ Funcionalidades

- Busca de artistas do Spotify com paginação e pesquisa dinâmica.
- Visualização de detalhes do artista, álbuns e faixas mais populares.
- UI responsiva, moderna e consistente.
- Internacionalização (EN/PT-BR) com seletor de idioma.
- Código modular, tipado e de fácil manutenção.

## 📁 Estrutura de Pastas

```
src/
  components/
    artist-page/
    artists-table/
    ui/
  hooks/
  lib/
  routes/
  assets/
```

- **components/**: Componentes.
- **hooks/**: Hooks customizados para integração com a API do Spotify.
- **lib/**: Utilitários, configuração de i18n e integração com a API.
- **routes/**: Rotas da aplicação (TanStack Router).

## 🧪 Testes

Escrevi apenas um teste unitário, infelizmente por questão de prazo não pude expandir e nem utilizar as melhores práticas.
O caminho que sigo para testes é de criar testes unitários para componentes isolados, testes de integração para fluxos principais e2e para simular a experiência do usuário. Minha referência de boas práticas tem sido o material do Kent C. Dodds (https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications).

## 🌎 Internacionalização

- Suporte a inglês e português.
- Seletor de idioma no cabeçalho.
- Todos os textos da UI extraídos para arquivos de tradução.
