# Project Guidelines

## Getting Started

### 1. Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/Ambrish5211/SACRED-HEARTS.git
cd SACRED_HEARTS
```

### 2. Set Up Environment Variables
- Go to the `backend` directory and copy the sample environment file:
  ```bash
  cp backend/.env.sample backend/.env
  # Edit backend/.env and fill in all required values (e.g., MongoDB URI, Cloudinary credentials, etc.)
  ```
- Go to the `frontend` directory and copy the sample environment file:
  ```bash
  cp frontend/.env.sample frontend/.env
  # Edit frontend/.env and set the correct API base URL if needed
  ```
- Review the `.env.sample` files for all required variables.

### 3. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (local or use the provided Docker setup)
- **Cloudinary account** (for media uploads; get your API credentials from https://cloudinary.com/)

---

## Running the Application

### Option 1: Using Docker (Recommended)
1. Make sure your `.env` files are set up in both backend and frontend as described above.
2. Start all services (backend, frontend, MongoDB) with Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. The backend will be available at http://localhost:4000 and the frontend at http://localhost:5173 by default.

### Option 2: Without Docker (Manual Setup)

#### Backend
1. Ensure MongoDB is running locally (or update your `.env` to point to a remote instance).
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend dev server:
   ```bash
   npm run dev
   ```
3. The frontend will be available at http://localhost:5173.

---

**Note:**
- Make sure to configure all required environment variables in your `.env` files.
- For production, use optimized builds and secure environment management.
- You must have valid Cloudinary credentials for media upload features to work.
