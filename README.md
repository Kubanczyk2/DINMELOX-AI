# DINMELOX AI

Webowy starter aplikacji do tworzenia muzyki AI. Projekt używa Next.js i ma przygotowaną integrację serwerową z Mureka API.

## Uruchomienie lokalne

Wymagania: Node.js 20.9 lub nowszy.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Otwórz `http://localhost:3000`. W `.env.local` ustaw `MUREKA_API_KEY`.

## Publikacja przez GitHub + Vercel

GitHub przechowuje kod, a Vercel uruchamia aplikację Next.js (w tym endpointy `/api/*`). GitHub Pages nie uruchomi serwerowych endpointów API tego projektu.

1. Zaloguj się na GitHub i utwórz nowe repozytorium, np. `dinmelox-ai`.
2. Wybierz opcję dodania plików (Add file → Upload files).
3. Rozpakuj ZIP projektu na komputerze i przeciągnij zawartość folderu `DINMELOX-AI` do repozytorium. Prześlij również folder `.github` (GitHub może wymagać dodania go przez interfejs uploadu).
4. Zatwierdź zmiany przyciskiem **Commit changes**.
5. Zaloguj się na https://vercel.com/ i wybierz **Add New → Project**.
6. Połącz konto GitHub, wybierz repozytorium `dinmelox-ai` i kliknij **Deploy**.
7. W ustawieniach projektu Vercel otwórz **Settings → Environment Variables**.
8. Dodaj zmienną `MUREKA_API_KEY` i wklej swój prywatny klucz API. Nie umieszczaj klucza w kodzie ani w repozytorium.
9. Wybierz **Redeploy**, aby wdrożenie pobrało nową zmienną.

Po wdrożeniu Vercel pokaże adres strony. Każdy kolejny push do gałęzi `main` uruchomi automatyczne wdrożenie.

## GitHub Actions

Workflow w `.github/workflows/ci.yml` sprawdza, czy projekt buduje się poprawnie po pushu i przy pull requestach.

## Ważne

- Nie commituj `.env.local` ani prawdziwych kluczy API.
- Samo wdrożenie strony nie zapewnia dostępu do silnika generowania. Potrzebny jest aktywny klucz API, konto u dostawcy i zgodność z jego warunkami.
- Integracja API jest szkieletem startowym; przed produkcyjnym użyciem trzeba potwierdzić aktualne endpointy, parametry i format odpowiedzi w dokumentacji dostawcy.
- Biblioteka użytkownika, logowanie, płatności, odtwarzacz i pobieranie plików wymagają kolejnych etapów implementacji.
