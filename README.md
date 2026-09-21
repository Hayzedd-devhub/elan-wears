# Digital Catalog App

A production-ready Next.js digital catalog / price list web app designed for small businesses.

## Features

- **Mobile-first, responsive design** - Works perfectly on all devices
- **No user authentication required** - Customers can browse freely
- **Anonymous user tracking** - Each visitor gets a unique ID stored in localStorage
- **Category-based browsing** - Tab navigation to switch between categories
- **Search functionality** - Search items across all categories
- **Favourite system** - Users can favourite items (saved locally + database)
- **WhatsApp integration** - Click-to-Chat with pre-filled messages
- **Admin panel** - Protected admin section for managing items
- **Image uploads** - Cloudinary integration for image storage
- **Favourites insights** - Admin view of most favourited items

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Image Hosting**: Cloudinary

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

See `.env.example` for the full, authoritative list of variables and comments
on each. In short:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/catalog

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
# (Not required - the first user to login will be created as admin)

# WhatsApp Number (format: 2348012345678, digits only, no + sign)
NEXT_PUBLIC_WHATSAPP_NUMBER=2348012345678

# Business Name
NEXT_PUBLIC_BUSINESS_NAME=Your Business Name
```

## Deploying for a New Client (White-Label)

This codebase is designed so that a new client deployment only requires a new
set of environment variables — no code changes should be necessary. Checklist:

1. Create a new hosting project (e.g. a new Vercel project) from this same repo/branch.
2. Set all variables from `.env.example` for that client (own Mongo DB, own Cloudinary account, own business name/WhatsApp number/URL).
3. **Logo / background** — pick one:
   - Replace `public/logo-main.jpeg` and `public/background.jpeg` with the client's images before building, or
   - Host the images externally and set `NEXT_PUBLIC_LOGO_URL` / `NEXT_PUBLIC_BACKGROUND_URL` — no rebuild needed to swap them later.
4. **Favicon / app icons** — these are picked up automatically by Next.js's file-based icon convention (no code involved), so they must be replaced with the client's own icon before building:
   - `app/favicon.ico`, `app/apple-icon.png`, `app/icon0.svg`, `app/icon1.png`
   - `public/web-app-manifest-192x192.png`, `public/web-app-manifest-512x512.png` (used by `app/manifest.ts` for the PWA icon)
   - A tool like [realfavicongenerator.net](https://realfavicongenerator.net) can generate a matching set from the client's logo in one pass.
5. **Colors** — set `NEXT_PUBLIC_THEME_COLOR` (base/dark) and `NEXT_PUBLIC_ACCENT_COLOR` (highlight) to recolor the whole app — no rebuild-only edit needed. The canonical palette itself still lives in the `@theme` block at the top of `app/globals.css` (`--color-gold`, `--color-chocolate`, etc.); the env vars override those at runtime (see `lib/theme.ts`). Only touch `globals.css` directly if a client needs a structurally different palette (e.g. more than two brand hues).
6. Log in at `/admin/login` once — the first username/password entered becomes that deployment's permanent admin account.
7. If a client ever needs a genuinely different component (not just different text/colors/logo), keep it out of the shared components and gate it behind its own env var (e.g. `NEXT_PUBLIC_CLIENT_ID`) rather than branching the codebase — no client currently needs this.

Each client should have its own `.env` — never reuse one client's `.env` file as a starting point that then gets hand-edited for another; keep credentials per-deployment (e.g. one Vercel env group per project).

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
catelog/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── insights/route.ts   # Favourites insights endpoint
│   │   │   └── login/route.ts      # Admin login endpoint
│   │   ├── categories/route.ts     # Get all categories
│   │   ├── favourites/route.ts     # Favourite items endpoint
│   │   ├── items/
│   │   │   ├── [id]/route.ts       # Item CRUD operations
│   │   │   └── route.ts            # Items list endpoint
│   │   └── upload/route.ts         # Image upload endpoint
│   ├── admin/
│   │   ├── dashboard/page.tsx      # Admin dashboard
│   │   ├── insights/page.tsx       # Favourites insights
│   │   ├── items/page.tsx          # Manage items
│   │   └── login/page.tsx          # Admin login
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── AdminLayout.tsx             # Admin sidebar layout
│   ├── AdminSidebar.tsx            # (if separate)
│   ├── CatalogClient.tsx           # Main catalog client
│   ├── CategoryTabs.tsx            # Category navigation
│   ├── Header.tsx                  # App header
│   ├── ItemCard.tsx                # Item display card
│   ├── ItemForm.tsx                # Item add/edit form
│   └── ItemModal.tsx               # Item detail modal
├── hooks/
│   └── useAnonymousUser.ts         # Anonymous user ID hook
├── lib/
│   ├── cloudinary.ts               # Cloudinary utilities
│   └── mongodb.ts                  # MongoDB connection
├── models/
│   ├── Favourite.ts                # Favourite model
│   └── Item.ts                     # Item model
├── .env.local                      # Environment variables
├── .env.example                    # Environment template
├── next.config.ts                  # Next.js config
├── package.json
└── tailwind.config.ts              # Tailwind config
```

## Admin Panel

Access the admin panel at `/admin/login`

There are no default or env-configured credentials. The first username/password
submitted at that URL is created as the permanent admin account for that
deployment (stored in MongoDB, password hashed).

### Admin Features

1. **Dashboard** - Overview stats (total items, categories, favourites)
2. **Manage Items** - Add, edit, delete items with image uploads
3. **Insights** - View most favourited items and user engagement

## Customer Features

1. **Browse Items** - Grid view of all items
2. **Filter by Category** - Tab-based category navigation
3. **Search** - Search items across all categories
4. **Favourite Items** - Save items to favourites
5. **Share via WhatsApp** - Send item details to business

## API Endpoints

### Items
- `GET /api/items` - Get all items (with optional `?category=xxx`)
- `POST /api/items` - Create new item
- `GET /api/items/[id]` - Get single item
- `PUT /api/items/[id]` - Update item
- `DELETE /api/items/[id]` - Delete item

### Categories
- `GET /api/categories` - Get all categories

### Favourites
- `GET /api/favourites?userId=xxx` - Get user's favourites
- `POST /api/favourites` - Toggle favourite (requires `itemId`, `anonymousUserId`)

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/insights` - Get favourites insights

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

## Production Considerations

1. **Set a strong admin password** - Whatever is entered on first `/admin/login` becomes permanent, so use a strong password the first time
2. **Use production MongoDB** - Consider MongoDB Atlas for cloud database
3. **Configure Cloudinary** - Set up proper Cloudinary credentials
4. **HTTPS** - Ensure SSL certificate for production
5. **Rate limiting** - Add rate limiting to API endpoints
6. **Error handling** - Improve error logging and monitoring

## License

MIT

## Authur
ZeddHub


