# team-6-marketplace
CEN3031 project - Gator Marketplace

A full-stack marketplace application for UF students, built with FastAPI (backend) and React (frontend).

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL (or use SQLite for development)

### Backend Setup

1. **Navigate to the project root:**
```bash
cd team-6-marketplace
```

2. **Install Python dependencies:**
```bash
pip install -r backend/requirements.txt
```

3. **Configure environment variables:**

Create a `.env` file in the project root with:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/gator_marketplace
# For SQLite (development): DATABASE_URL=sqlite:///./gator_marketplace.db

# Security Configuration
SECRET_KEY=your-secret-key-min-32-chars-long-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Important:** Never commit your `.env` file. The `.gitignore` already excludes it.

4. **Initialize the database:**
```bash
./backend/migrate
```

5. **Seed the database (optional but recommended):**
```bash
./backend/seed
```

This creates:
- **5 users** (2 admins, 3 regular users)
- **100 items** (20 per category: school, apparel, living, services, tickets)

Default seed users:
| Email | Password | Role |
|-------|----------|------|
| admin1@ufl.edu | Passw0rd1! | Admin |
| admin2@ufl.edu | Passw0rd2! | Admin |
| user1@ufl.edu | UserPass1! | User |
| user2@ufl.edu | UserPass2! | User |
| seed_owner@ufl.edu | SeedPass! | User |

6. **Start the backend server:**
```bash
./backend/run
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Configure frontend to use real API:**

Edit `frontend/src/App.tsx` and set:
```typescript
const MOCK_MODE = false;  // Set to false to use real backend
```

3. **Start the frontend development server:**
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🧪 Testing

### Run Backend Tests
```bash
./backend/test
```

Or with coverage:
```bash
cd backend
pytest tests/ -v --cov=backend --cov-report=html
```

### Test Coverage
- Authentication (signup, login, token validation)
- Item CRUD operations
- Authorization (owner/admin checks)
- Seed script idempotency

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Authentication Endpoints

#### POST `/signup`
Register a new user.

**Request:**
```json
{
  "username": "john",
  "email": "john@ufl.edu",
  "password": "SecurePass1!"
}
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@ufl.edu",
  "is_admin": false
}
```

**Notes:**
- Email must end with `@ufl.edu`
- Password must contain: uppercase, lowercase, special character
- Minimum 8 characters

#### POST `/login`
Login and get access token.

**Request (form-data):**
```
username: john@ufl.edu (or username)
password: SecurePass1!
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "email": "john@ufl.edu",
    "username": "john",
    "is_admin": false
  }
}
```

**Usage:**
Include token in subsequent requests:
```
Authorization: Bearer <access_token>
```

### Item Endpoints

#### GET `/items/active`
Get all active items.

**Authentication:** Not required

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Calculus Textbook",
    "price": 45.00,
    "seller_id": 2,
    "category": "school",
    "description": "Used calculus textbook",
    "image": "https://...",
    "is_active": true,
    "seller": {
      "email": "user@ufl.edu"
    }
  }
]
```

#### POST `/items`
Create a new item listing.

**Authentication:** Required

**Request:**
```json
{
  "title": "Graphing Calculator",
  "price": 75.00,
  "category": "school",
  "description": "TI-84 in excellent condition",
  "image": "https://example.com/image.jpg",
  "is_active": true
}
```

**Response (201):**
```json
{
  "id": 101,
  "title": "Graphing Calculator",
  "price": 75.00,
  "seller_id": 1,
  "category": "school",
  "description": "TI-84 in excellent condition",
  "image": "https://example.com/image.jpg",
  "is_active": true,
  "seller": {
    "email": "john@ufl.edu"
  }
}
```

#### PUT `/items/{id}/mark-sold`
Mark an item as sold (inactive).

**Authentication:** Required (owner or admin)

**Response (200):**
```json
{
  "id": 1,
  "title": "Calculus Textbook",
  "price": 45.00,
  "is_active": false,
  ...
}
```

**Error (403):**
```json
{
  "detail": "You don't have permission to mark this item as sold"
}
```

#### DELETE `/items/{id}`
Delete an item.

**Authentication:** Required (owner or admin)

**Response (200):**
```json
{
  "detail": "Item deleted successfully"
}
```

**Error (403):**
```json
{
  "detail": "You don't have permission to delete this item"
}
```

## 🔧 Developer Scripts

All scripts are located in `backend/` and are executable:

- `./backend/run` - Start development server with hot reload
- `./backend/seed` - Seed database with test data (idempotent)
- `./backend/test` - Run test suite
- `./backend/migrate` - Initialize database tables

## 📝 Example API Usage (curl)

### Register a new user
```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "testuser@ufl.edu",
    "password": "TestPass1!"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser@ufl.edu&password=TestPass1!"
```

### Get active items
```bash
curl http://localhost:8000/items/active
```

### Create an item (with auth)
```bash
TOKEN="your_access_token_here"
curl -X POST http://localhost:8000/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Chemistry Textbook",
    "price": 55.00,
    "category": "school",
    "description": "Intro to Chemistry, 2nd Edition",
    "image": "https://example.com/chem.jpg"
  }'
```

### Mark item as sold (with auth)
```bash
TOKEN="your_access_token_here"
curl -X PUT http://localhost:8000/items/1/mark-sold \
  -H "Authorization: Bearer $TOKEN"
```

### Delete an item (with auth)
```bash
TOKEN="your_access_token_here"
curl -X DELETE http://localhost:8000/items/1 \
  -H "Authorization: Bearer $TOKEN"
```

## 🗂️ Project Structure

```
team-6-marketplace/
├── backend/
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   └── items.py         # Item CRUD endpoints
│   ├── scripts/
│   │   └── seed_db.py       # Database seeding script
│   ├── tests/
│   │   ├── conftest.py      # Test fixtures
│   │   ├── test_auth.py     # Auth tests
│   │   ├── test_items.py    # Item tests
│   │   └── test_seed.py     # Seed script tests
│   ├── database.py          # Database configuration
│   ├── dependencies.py      # FastAPI dependencies
│   ├── main.py              # FastAPI app setup
│   ├── models.py            # SQLModel database models
│   ├── security.py          # Security utilities
│   ├── requirements.txt     # Python dependencies
│   ├── run                  # Start server script
│   ├── seed                 # Seed database script
│   ├── test                 # Run tests script
│   └── migrate              # Initialize DB script
├── frontend/
│   └── src/
│       ├── components/      # React components
│       ├── App.tsx          # Main app component
│       └── mockApi.ts       # Mock API (for testing)
├── .env                     # Environment variables (create this)
├── .gitignore
└── README.md
```

## 🔐 Security Notes

- Never commit `.env` file or secrets to Git
- Always use strong passwords in production
- The seed script passwords are for **development only**
- Change `SECRET_KEY` before deploying to production
- Use HTTPS in production
- Keep dependencies updated

## 🐛 Troubleshooting

### Database connection errors
- Verify `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running (or use SQLite for dev)
- Run `./backend/migrate` to initialize tables

### Authentication errors
- Check that `SECRET_KEY`, `ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES` are set in `.env`
- Verify token is included in request headers: `Authorization: Bearer <token>`

### Frontend not connecting to backend
- Ensure backend is running on port 8000
- Set `MOCK_MODE = false` in `frontend/src/App.tsx`
- Check CORS settings in `backend/main.py`

## 📄 License

CEN3031 Course Project
