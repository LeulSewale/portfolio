# Portfolio Backend API

Node.js + Express + MongoDB backend for the dynamic portfolio application.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Local or Atlas
MONGODB_URI=mongodb://localhost:27017/portfolio
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars-long
JWT_EXPIRES_IN=7d

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
ADMIN_EMAIL=admin@example.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB
**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
1. Create free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

### 4. Run Data Migration
```bash
npm run migrate
```

This will:
- Clear existing database
- Import data from `../data/content.json`
- Create admin user with credentials from `.env`

### 5. Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Public Endpoints (No Auth)

- `GET /api/profile` - Get active profile
- `GET /api/projects` - Get active projects
- `GET /api/skills` - Get active skill categories
- `GET /api/testimonials` - Get active testimonials

### Auth Endpoints

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify token

### Admin Endpoints (Auth Required)

**Profile**
- `GET /api/profile/admin` - Get profile (all data)
- `PUT /api/profile/admin` - Update profile

**Projects**
- `GET /api/projects/admin` - Get all projects
- `POST /api/projects/admin` - Create project
- `PUT /api/projects/admin/:id` - Update project
- `DELETE /api/projects/admin/:id` - Delete project
- `PATCH /api/projects/admin/:id/toggle` - Toggle visibility
- `PATCH /api/projects/admin/reorder` - Reorder projects

**Skills**
- `GET /api/skills/admin` - Get all skills
- `POST /api/skills/admin` - Create skill category
- `PUT /api/skills/admin/:id` - Update skill category
- `DELETE /api/skills/admin/:id` - Delete skill category
- `PATCH /api/skills/admin/:id/toggle` - Toggle visibility
- `PATCH /api/skills/admin/reorder` - Reorder skills

**Testimonials**
- `GET /api/testimonials/admin` - Get all testimonials
- `POST /api/testimonials/admin` - Create testimonial
- `PUT /api/testimonials/admin/:id` - Update testimonial
- `DELETE /api/testimonials/admin/:id` - Delete testimonial
- `PATCH /api/testimonials/admin/:id/toggle` - Toggle visibility

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── models/         # Mongoose models
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── middlewares/    # Custom middleware
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   └── server.ts       # Express app setup
├── package.json
├── tsconfig.json
└── .env
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run data migration

## Authentication

- JWT-based authentication
- Tokens stored in httpOnly cookies
- 7-day token expiration (configurable)
- Protected routes require valid token

## Production Deployment

### Deploy Backend (Render/Railway/Heroku)

1. Push backend code to Git
2. Connect repository to hosting service
3. Set environment variables
4. Deploy

### MongoDB Atlas Setup

1. Create cluster
2. Configure network access (0.0.0.0/0 for production)
3. Get connection string
4. Update `MONGODB_URI`

### Security Checklist

- ✅ Change `ADMIN_PASSWORD` to strong password
- ✅ Use strong `JWT_SECRET` (32+ characters)
- ✅ Set `NODE_ENV=production`
- ✅ Use `MONGODB_URI` from Atlas
- ✅ Configure proper CORS origin
- ✅ Enable HTTPS (handled by hosting platform)

## Troubleshooting

**MongoDB Connection Failed**
- Check if MongoDB is running
- Verify connection string
- Check network/firewall settings

**Migration Failed**
- Ensure MongoDB is running
- Check `content.json` file exists
- Verify data format matches expected structure

**Authentication Not Working**
- Check if admin user was created
- Verify JWT_SECRET is set
- Check cookie settings (httpOnly, secure)
