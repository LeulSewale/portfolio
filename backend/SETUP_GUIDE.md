# Backend Setup & Testing Guide

## ✅ What's Been Completed

### Backend Infrastructure (100%)
- ✅ Complete Express.js server with TypeScript
- ✅ 5 Mongoose models (Profile, Project, SkillCategory, Testimonial, AdminUser)
- ✅ 5 Controllers with full CRUD operations
- ✅ JWT authentication system
- ✅ Request validation middleware
- ✅ Error handling middleware
- ✅ CORS and security configuration
- ✅ Data migration script
- ✅ All API routes (public + admin)

### Frontend API Integration (100%)
- ✅ API client utility
- ✅ 5 Service modules (auth, profile, projects, skills, testimonials)
- ✅ Environment configuration

## 🚀 Next Steps to Get Backend Running

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended - Free & Easy)**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a FREE cluster (M0 Sandbox)
4. Create database user:
   - Username: `portfolio_admin`
   - Password: (generate strong password)
5. Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Replace `/test` with `/portfolio`

**Option B: Local MongoDB**

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify it's running
mongo --version
```

### Step 2: Configure Backend Environment

Update `backend/.env` with your MongoDB URI:

```bash
cd backend

# If using MongoDB Atlas:
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://portfolio_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/portfolio
JWT_SECRET=super-secret-jwt-key-min-32-characters-long-change-this
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:3000
EOF

# If using local MongoDB:
cat > .env << 'EOF'
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=super-secret-jwt-key-min-32-characters-long-change-this
JWT_EXPIRES_IN=7d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
ADMIN_EMAIL=admin@example.com
FRONTEND_URL=http://localhost:3000
EOF
```

### Step 3: Run Data Migration

```bash
# From backend directory
cd backend
npm run migrate
```

**Expected Output:**
```
✅ MongoDB connected successfully
📊 Database: portfolio

🔄 Starting data migration...

🗑️  Clearing existing data...
👤 Migrating profile data...
✅ Profile migrated: Leul Sewale

📁 Migrating projects...
✅ Project migrated: Nutemaru Application
✅ Project migrated: Online-bus Booking Application
...

💻 Migrating skills...
✅ Skill category migrated: Frontend Development
...

💬 Migrating testimonials...
✅ Testimonial migrated: Abel Mulugeta

🔐 Creating admin user...
✅ Admin user created: admin

📊 Migration Summary:
   Profile: 1 migrated
   Projects: 6 migrated
   Skills: 8 categories migrated
   Testimonials: 1 migrated
   Admin Users: 1 created

✨ Migration completed successfully!
```

### Step 4: Start Backend Server

```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
📊 Database: portfolio
🚀 Server running on port 5000
📝 Environment: development
🌐 Frontend URL: http://localhost:3000
```

### Step 5: Test Backend APIs

**Test Public Endpoints (No Auth Required):**

```bash
# Test profile endpoint
curl http://localhost:5000/api/profile

# Test projects endpoint
curl http://localhost:5000/api/projects

# Test skills endpoint
curl http://localhost:5000/api/skills

# Test testimonials endpoint
curl http://localhost:5000/api/testimonials

# Health check
curl http://localhost:5000/health
```

**Test Admin Login:**

```bash
# Login (will return token in cookie)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"changeme123"}' \
  -c cookies.txt

# Test admin endpoint with cookie
curl http://localhost:5000/api/projects/admin \
  -b cookies.txt
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "username": "admin",
      "role": "admin"
    }
  },
  "message": "Login successful"
}
```

## 🔧 Troubleshooting

### "MongoDB connection error"
- **Check MongoDB is running** (local) or connection string is correct (Atlas)
- **Network access**: For Atlas, ensure 0.0.0.0/0 is allowed
- **Database user**: Verify username/password are correct

### "Migration failed"
- Ensure `data/content.json` exists in parent directory
- Check MongoDB connection is working
- Verify `.env` file has correct `MONGODB_URI`

### "Port 5000 already in use"
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill process using port 5000: `lsof -ti:5000 | xargs kill -9`

### TypeScript lint errors in IDE
- Normal after initial setup
- Run `npm run build` in backend folder to compile
- Or restart VS Code

## 📋 API Testing Checklist

Once backend is running, test these endpoints:

**Public APIs:**
- [ ] GET `/api/profile` - Returns profile data
- [ ] GET `/api/projects` - Returns active projects only
- [ ] GET `/api/skills` - Returns active skills only  
- [ ] GET `/api/testimonials` - Returns active testimonials only

**Authentication:**
- [ ] POST `/api/auth/login` - Login with admin/changeme123
- [ ] GET `/api/auth/verify` - Verify token (with cookie)
- [ ] POST `/api/auth/logout` - Logout

**Admin APIs (after login):**
- [ ] GET `/api/projects/admin` - Returns ALL projects
- [ ] POST `/api/projects/admin` - Create new project
- [ ] PUT `/api/projects/admin/:id` - Update project
- [ ] DELETE `/api/projects/admin/:id` - Delete project
- [ ] PATCH `/api/projects/admin/:id/toggle` - Toggle visibility

## 🎯 After Backend is Working

Once you've confirmed the backend APIs work:

1. **Keep backend running** on port 5000
2. **Update frontend** to use backend APIs (I can help with this)
3. **Test admin panel** with real database
4. **Deploy to production**

## 📝 Common Commands Reference

```bash
# Backend commands (from /backend directory)
npm run dev          # Start development server
npm run build        # Compile TypeScript
npm start            # Start production server
npm run migrate      # Run data migration

# Check MongoDB (if local)
mongo                # Open MongoDB shell
show dbs             # List databases
use portfolio        # Switch to portfolio database
db.projects.find()   # Query projects collection
```

## 🌐 Production Deployment (Later)

When ready for production:

1. **MongoDB Atlas**: Already production-ready
2. **Backend Hosting**: Deploy to Render, Railway, or Heroku
3. **Environment Variables**: Set all ENV vars on hosting platform
4. **Frontend**: Update `NEXT_PUBLIC_API_URL` to production backend URL

---

## ⚡ Quick Start Summary

```bash
# 1. Configure environment
cd backend
# Edit .env with your MongoDB URI

# 2. Run migration
npm run migrate

# 3. Start server
npm run dev

# 4. Test in another terminal
curl http://localhost:5000/api/profile
```

If you see data returned, **the backend is working! 🎉**
