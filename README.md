<h1 align="center">LocalLoop</h1>
<p align="center"><em>Platforma gospodarki obiegu zamkniętego dla lokalnych społeczności</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=flat&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Claude_AI-4AB8A4?style=flat" />
</p>

---

## O projekcie

LocalLoop to mobilna i webowa aplikacja stworzona dla startupu **GreenPulse**, którego misją jest budowanie lokalnej gospodarki obiegu zamkniętego wewnątrz osiedli. Aplikacja działa jak „Tinder dla zasobów" — łączy sąsiadów, którzy chcą dzielić się przedmiotami, umiejętnościami i usługami, eliminując bariery wejścia takie jak konieczność pisania ogłoszeń, wyceniania usług czy obawy przed interakcją z obcymi.

| | |
|---|---|
| **Problem** | Ludzie posiadają nieużywane przedmioty i umiejętności, ale bariera wejścia (pisanie ogłoszeń, wycenianie, brak zaufania) jest zbyt wysoka. |
| **Rozwiązanie** | LocalLoop automatyzuje tworzenie ofert przez AI, buduje zaufanie systemem punktów społecznych i upraszcza komunikację wbudowanym czatem. |
| **Grupa docelowa** | Mieszkańcy osiedli i bloków, którzy chcą aktywnie uczestniczyć w lokalnej wymianie zasobów. |
| **Technologia** | React + TypeScript, Firebase, Anthropic Claude AI |

---

## Funkcjonalności

### 🏠 Dashboard

Główny ekran aplikacji — centrum aktywności lokalnej społeczności.

**Aktywność sąsiadów**
- Zunifikowana lista wszystkich aktywnych ofert i próśb (Favors & Helps) z całego osiedla
- Wyświetlanie najnowszych ogłoszeń w czasie rzeczywistym (synchronizacja Firebase Firestore)
- Podgląd szczegółów każdej oferty: tytuł, kategoria, opis, zdjęcie, autor, lokalizacja, dostępność
- Możliwość rozpoczęcia chatu z właścicielem ogłoszenia bezpośrednio z widoku szczegółów

**Twoje statystyki**
- **Zdrowie Społeczności** — agregowana miara aktywności użytkownika w lokalnej sieci
- **Impact Score** — punktacja uwzględniająca liczbę zakończonych wymian, wystawionych ocen i ogólną aktywność
- **Licznik wymian** — łączna ilość zrealizowanych transakcji

---

### 🤝 Poproś o pomoc (Favors) & Udostępnij (Helps)

Dwa dedykowane widoki do przeglądania próśb o pomoc oraz ofert przedmiotów i usług.

**Wyszukiwanie i filtrowanie**
- Pole wyszukiwania tekstowego — przeszukuje tytuły i opisy ogłoszeń w czasie rzeczywistym
- Filtracja według kategorii:
  - Naprawa · Transport · Edukacja · Dom i ogród
  - Opieka · Gotowanie · Narzędzia · Ogród
- Sortowanie: **Najnowsze** | **Najstarsze**
- Przycisk `+` — szybkie przejście do formularza dodawania nowej oferty lub prośby

---

### 💬 Wiadomości

Wbudowany system czatu umożliwiający bezpośrednią komunikację między użytkownikami.

- Czat 1:1 z innymi użytkownikami platformy (Firebase Realtime)
- Synchronizacja rozmów w czasie rzeczywistym — nowe wiadomości pojawiają się natychmiast
- Usuwanie wątków — trwałe usunięcie wybranej rozmowy
- Przycisk **„Zgłoś się!"** — wyrażenie zainteresowania ofertą bez wychodzenia z chatu
- System decyzji właściciela — kandydat oczekuje na akceptację lub odrzucenie
- **Asystent AI** — generowanie gotowych fraz konwersacyjnych (jedno kliknięcie wstawia sugerowaną odpowiedź dopasowaną kontekstowo)

---

### 📋 Moje ogłoszenia

Panel zarządzania własnymi ofertami i prośbami.

- Zakładka **Aktualne** — lista aktywnych ogłoszeń oczekujących na realizację
- Zakładka **Zakończone** — archiwum zrealizowanych lub zamkniętych transakcji
- Dodawanie nowej oferty lub prośby bezpośrednio z panelu
- Usuwanie ogłoszeń — trwałe usunięcie zbędnych lub błędnie dodanych pozycji

---

### ➕ Dodaj ofertę (Favor) lub prośbę (Help)

Formularz tworzenia nowego ogłoszenia — ręczny lub wspomagany przez AI.

| Pole | Opis |
|------|------|
| Tytuł | Krótka, zwięzła nazwa oferty lub prośby |
| Kategoria | Wybór z predefiniowanej listy |
| Opis | Szczegółowe informacje o przedmiocie, usłudze lub potrzebie |
| Sugerowana wymiana | Co oferujesz w zamian (przedmiot, usługa, czas) |
| Punkty społecznościowe | Propozycja wartości w wewnętrznej walucie |
| Dostępność | Preferowane daty i godziny |
| Zdjęcie | Opcjonalne zdjęcie (upload do Firebase Storage) |

> **✨ Generuj z AI** — analizuje kontekst i automatycznie wypełnia wszystkie pola formularza. Propozycje można edytować przed zapisaniem.

---

### 👤 Profil użytkownika

Centrum konfiguracji konta i preferencji.

**Motyw aplikacji**
- Przełącznik **tryb ciemny | tryb jasny** dostępny bezpośrednio na stronie profilu
- Wybór zapisywany w `localStorage` i przywracany przy każdym uruchomieniu

**Powiadomienia**
- `Wszystkie` — każde powiadomienie z platformy
- `Ważne` — tylko nowe zgłoszenia do własnych ogłoszeń i wiadomości
- `Wyłączone` — brak powiadomień push

**Edycja profilu**
- Zdjęcie profilowe, Imię, E-mail, Bio, Okolica, Wiek, Płeć

**Bezpieczeństwo**
- Zmiana hasła (weryfikacja starego → ustawienie nowego → zapis w Firebase Auth)
- Trwałe usunięcie konta i wszystkich powiązanych danych

---

## System punktów społecznych

LocalLoop używa wewnętrznej waluty — **Community Points \ Impact Score** — aby motywować aktywność i budować zaufanie bez konieczności użycia prawdziwych pieniędzy.

- 📈 **Zdobywasz punkty za:** dodanie oferty, zrealizowaną wymianę, wystawienie i otrzymanie pozytywnej oceny, korzystaniu z ofert innych użytkowników i pomoc innym
- 💚 **Zdrowie Społeczności** — globalny wskaźnik żywotności osiedla obliczany z aktywności wszystkich użytkowników

---

## Architektura techniczna

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React 18 + TypeScript, Vite, Tailwind CSS |
| Animacje | Motion for React (Framer Motion) |
| Ikony | Lucide Icons + tw-animate-css |
| Routing | React Router v6 |
| Backend (przyszły) | FastAPI |
| AI | Anthropic Claude API (`claude-sonnet-4`) |
| Baza danych | Firebase Firestore (Realtime sync) |
| Autentykacja | Firebase Authentication |
| Storage | Firebase Storage |
| Motyw | ThemeContext + CSS custom properties + `localStorage` |

---

## Plan rozwoju projektu

1. **Dyskusja z LLM Gemini** — wstępne omówienie i strukturyzacja projektu, określenie zakresu MVP
2. **Design w Figma Make** — projekt interfejsu z wykorzystaniem AI-Powered Design Tools
3. **Claude / Gemini — MVP** — implementacja pierwszej wersji: komponenty, routing, logika biznesowa
4. **Finalizacja i Bug Fixing** — ulepszenia za pomocą Google Gemini / DeepSeek
5. **Local Storage** — tymczasowe przechowywanie danych użytkownika po stronie klienta
6. **Firebase Firestore** — migracja z Local Storage na produkcyjny backend w chmurze
7. **Jasny motyw** — ThemeContext, CSS custom properties, persystencja w `localStorage`

---

## Technology Stack & Tools

### 🎨 Narzędzia projektowe

| Narzędzie | Zastosowanie |
|-----------|-------------|
| [Figma Make](https://figma.com) | Flow i prototypy — AI-Powered Design Tools |
| [recraft.ai](https://recraft.ai) | Generowanie logo jako SVG Vector |
| Notion | Notatki, planowanie, user stories, dokumentacja postępów |
| Gemini 3 PRO | Dyskusje i strukturyzacja projektu (Discussion mode) |

### 💻 Frontend

| Pakiet | Opis |
|--------|------|
| `react` + `vite` | Główny framework UI z szybkim bundlerem i HMR |
| `tailwindcss` | Utility-first CSS — stylowanie, responsywność, design tokens |
| `motion/react` | Animacje wejścia, przejścia między widokami, mikro-interakcje |
| `lucide-react` | Spójny zestaw ikon SVG |
| `tw-animate-css` | Dodatkowe klasy animacji Tailwind |
| `react-router-dom` | Routing po stronie klienta |

### ⚙️ Backend

| Pakiet | Opis |
|--------|------|
| FastAPI | Python REST API — planowany backend do zaawansowanej logiki AI |
| Anthropic LLM API | Aktualnie używane bezpośrednio — generowanie treści i fraz |

### 🗄️ Baza danych

| Usługa | Opis |
|--------|------|
| Firebase Firestore | NoSQL baza danych — ogłoszenia, użytkownicy, wiadomości w czasie rzeczywistym |
| Firebase Auth | Autentykacja — rejestracja, logowanie, zmiana hasła, usuwanie konta |
| Firebase Storage | Przechowywanie zdjęć profilowych i zdjęć ogłoszeń |
| Firebase Studio | Środowisko zarządzania projektem (konsola, reguły, indeksy) |

---

## Uruchomienie projektu

### Wymagania

- Node.js ≥ v22
- Konto Firebase z włączonymi: Authentication, Firestore, Storage
- Klucz API do LLM (np. Google ApiKeys)

### Instalacja

```bash
npm install
cp .env.example .env   # uzupełnij zmienne Firebase + Anthropic
npm run dev
```

### Zmienne środowiskowe

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ANTHROPIC_API_KEY=...
```

---



---------------------------------------------------------------
_**Creator: Anastasiia Bzova 2026**_
