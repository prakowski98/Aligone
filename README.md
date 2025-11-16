# Aligone Marketplace

Kompletna platforma aukcyjna podobna do Allegro, zbudowana w 2025 roku z wykorzystaniem nowoczesnych technologii.

## 🚀 Funkcjonalności

### Dla użytkowników
- ✅ Rejestracja i logowanie użytkowników (po polsku)
- ✅ Przeglądanie i wyszukiwanie aukcji
- ✅ Tworzenie własnych aukcji z uploadem zdjęć
- ✅ Licytowanie i zakup przedmiotów (Kup teraz/Licytuj)
- ✅ System wiadomości między użytkownikami
- ✅ Panel użytkownika (moje aukcje, zakupy, obserwowane)
- ✅ System ocen i komentarzy (feedback)
- ✅ Historia transakcji i zamówień
- ✅ Powiadomienia real-time
- ✅ Lista obserwowanych (watchlist)

### Dla administratorów
- ✅ Panel administratora
- ✅ Zarządzanie użytkownikami
- ✅ Zarządzanie aukcjami
- ✅ Zarządzanie kategoriami
- ✅ Statystyki i raporty

### UX/UI
- ✅ Nowoczesny design 2025 (inspirowany Allegro)
- ✅ Tryb ciemny i jasny
- ✅ Pełna responsywność (mobile, tablet, desktop)
- ✅ Szybki i płynny interfejs
- ✅ Polski język interfejsu

### Kategorie
Platform zawiera kompletny zestaw kategorii podobny do Allegro:
- 📱 **Elektronika** - Telefony, Komputery, RTV i AGD, Konsole i gry
- 👔 **Moda** - Odzież, Obuwie, Biżuteria i zegarki
- 🏠 **Dom i Ogród** - Meble, Ogród
- 🚗 **Motoryzacja** - Części samochodowe, Opony i felgi
- ⚽ **Sport i turystyka** - Rowery, Fitness
- 👶 **Dziecko** - Zabawki
- 📚 **Kultura i rozrywka** - Książki i komiksy
- 🐾 **Zwierzęta** - Psy, Koty
- 💄 **Uroda** - Kosmetyki, perfumy
- ⚕️ **Zdrowie** - Suplementy, sprzęt medyczny

## 🛠️ Stack Technologiczny

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io
- **File Upload:** Multer
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Real-time:** Socket.io Client
- **Icons:** Lucide React

## 📦 Struktura projektu

```
aligone-marketplace/
├── backend/          # API Server (Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── prisma/
│   └── uploads/
├── frontend/         # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── types/
│   └── public/
└── docker-compose.yml
```

## 🚀 Instalacja i uruchomienie

### Wymagania
- Node.js 20+
- PostgreSQL 14+
- npm lub yarn

### Krok 1: Instalacja zależności

```bash
npm install
```

### Krok 2: Konfiguracja środowiska

Utwórz pliki `.env` w katalogach `backend` i `frontend`:

**backend/.env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aligone"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Krok 3: Inicjalizacja bazy danych

```bash
cd backend
npx prisma generate
npx prisma db push
npx prisma db seed  # (opcjonalne - dane testowe)
cd ..
```

### Krok 4: Uruchomienie aplikacji

```bash
# Uruchomienie całej aplikacji (backend + frontend)
npm run dev

# Lub osobno:
npm run dev:backend
npm run dev:frontend
```

Aplikacja będzie dostępna pod adresem:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🐳 Docker

```bash
docker-compose up -d
```

## 📚 API Documentation

API dokumentacja dostępna pod adresem: http://localhost:5000/api/docs

### Główne endpointy

#### Autentykacja
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Pobierz aktualnego użytkownika

#### Aukcje
- `GET /api/auctions` - Lista aukcji (z filtrowaniem)
- `GET /api/auctions/:id` - Szczegóły aukcji
- `POST /api/auctions` - Utwórz aukcję
- `PUT /api/auctions/:id` - Edytuj aukcję
- `DELETE /api/auctions/:id` - Usuń aukcję

#### Licytacje
- `POST /api/auctions/:id/bid` - Złóż ofertę
- `GET /api/auctions/:id/bids` - Historia licytacji

#### Wiadomości
- `GET /api/messages` - Lista konwersacji
- `GET /api/messages/:userId` - Wiadomości z użytkownikiem
- `POST /api/messages` - Wyślij wiadomość

#### Admin
- `GET /api/admin/users` - Zarządzanie użytkownikami
- `GET /api/admin/auctions` - Zarządzanie aukcjami
- `GET /api/admin/stats` - Statystyki platformy

## 🎨 Funkcje UI

- **Responsive Design:** Działa idealnie na wszystkich urządzeniach
- **Dark/Light Mode:** Automatyczne przełączanie lub ręczny wybór
- **Real-time Updates:** Powiadomienia o nowych licytacjach i wiadomościach
- **Image Upload:** Przeciągnij i upuść zdjęcia
- **Advanced Search:** Filtrowanie po kategorii, cenie, lokalizacji
- **Infinite Scroll:** Płynne ładowanie aukcji

## 🔐 Bezpieczeństwo

- Haszowanie haseł z bcrypt
- JWT authentication z refresh tokens
- CORS protection
- Rate limiting
- SQL injection prevention (Prisma ORM)
- XSS protection
- Input validation

## 📄 Licencja

MIT

## 👨‍💻 Autor

Created with ❤️ using Claude AI
