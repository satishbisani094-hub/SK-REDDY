# SK Reddy Adventures - Adventure Travel Website

A professional, modern, responsive, full-stack adventure travel website for **SK Reddy Adventures**. It features a nature-inspired premium dark theme, tour listing/details/search/filters, a masonry gallery with categories, a fullscreen lightbox, enquiry submissions, and a password-protected admin dashboard.

---

## Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router**
- **Tailwind CSS v4** (CSS-first config)
- **Axios**
- **React Icons**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication**
- **Multer** (Local File Uploads)
- **bcryptjs**
- **dotenv**
- **cors**

---

## Project Structure

```text
sk-reddy-adventures/
│
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── assets/               # Image/svg static files
│   │   ├── components/           # Navbar, Footer, WhatsAppButton, TourCard, Skeleton, Toast
│   │   ├── pages/                # Home, About, Tours, TourDetails, Gallery, Contact, AdminLogin, AdminDashboard
│   │   ├── services/             # axios client api.js (ESM modules)
│   │   ├── App.jsx               # Navigation & Conditional Layout Routing
│   │   ├── index.css             # Tailwind v4 imports, global scrollbar and glassmorphism styles
│   │   └── main.jsx              # React Entrypoint wrapped in BrowserRouter
│   ├── index.html                # Main html container with Google Fonts & SEO tags
│   └── vite.config.js            # Vite + React + Tailwind v4 configs
│
├── backend/                      # Node + Express Server
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # controllers for Auth, Tours, Gallery, Enquiries
│   ├── middleware/               # Auth (JWT) and Upload (Multer) middleware
│   ├── models/                   # Mongoose schemas: Admin, Tour, Gallery, Enquiry
│   ├── routes/                   # Route handlers mapping endpoints to controllers
│   ├── uploads/                  # Upload directories (tours/ and gallery/)
│   ├── .env                      # Environment configurations
│   ├── server.js                 # Server bootstrapper & API router
│   └── package.json              # Backend dependencies
│
└── README.md                     # Setup instructions (This file)
```

---

## Installation & Setup

### Prerequisites
- **Node.js** (v16.x or higher recommended)
- **MongoDB** running locally on your system, or a MongoDB Atlas connection string.

### Step 1: Configure Backend Environment Variables
1. Navigate to the `backend` folder.
2. Open the `.env` file. It is pre-configured with local default values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skreddyadventures
   JWT_SECRET=supersecretadventurekey12345
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=adminpassword123
   NODE_ENV=development
   ```
   *Change `ADMIN_USERNAME` and `ADMIN_PASSWORD` to your preferred credentials before starting the server.*

### Step 2: Run the Backend Server
1. Open a terminal in `backend/` directory.
2. Install packages:
   ```bash
   npm install
   ```
3. Start the server (runs in hot-reload development mode via nodemon):
   ```bash
   npm run dev
   ```
   *When the backend starts for the first time, it automatically connects to MongoDB and seeds the Admin collection with the default credentials specified in your `.env` file.*

### Step 3: Run the Frontend Application
1. Open a new terminal in `frontend/` directory.
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Click the link shown in the terminal (usually `http://localhost:5173`) to view the application in your browser.

---

## Admin Portal Credentials
- **URL Path**: `http://localhost:5173/admin/login`
- **Default Username**: `admin` *(as defined in backend/.env)*
- **Default Password**: `adminpassword123` *(as defined in backend/.env)*

---

## Key Features & User Operations

### Public Visitors
- **Home Page**: Read biography overview, statistics, featured tours, customer testimonials, and base office locations.
- **Adventure Tours**: View upcoming travel expeditions. Search tours by title or location keyword, and filter tours by Easy, Medium, or Hard difficulty badges.
- **Tour Details**: View active cover image, additional photo galleries, itinerary timeline, pricing structure, slots remaining, and standard cost inclusions/exclusions.
- **Submit Enquiry**: Send booking enquiries directly from a tour details page or the Contact Us form. Submissions are saved to the MongoDB database.
- **Masonry Gallery**: Look at past adventure photos filtered by categories (Trekking, Camping, Hiking, Water Adventures, Mountain Tours). Open a fullscreen lightbox and cycle through images using the keyboard (Left/Right arrow keys, Escape to close).
- **Floating WhatsApp Icon**: Start a chat directly with SK Reddy Adventures with pre-populated message formats.

### Admin Actions (SK Reddy)
- **Manage Tours**: Add new tours with cover images and optional multiple gallery images. Edit textual specs or replace files. Delete tours (which automatically removes all associated image files from the backend storage directory to save disk space).
- **Manage Gallery**: Upload multiple past adventure photos at once, write catalog titles, and select adventure categories. Delete gallery records and files.
- **Customer Enquiries**: View the list of all submitted customer enquiries, containing names, emails, phones, messages, and timestamps. Delete enquiries once resolved.
