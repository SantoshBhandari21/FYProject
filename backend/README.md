# Rental Room Management System - Backend API

A comprehensive Node.js backend API for a rental room management system with role-based access control (Admin, Owner, Client).

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Owner, Client)
  - Secure password hashing with bcrypt

- **User Management** (Admin)
  - View all users
  - Update user details
  - Activate/deactivate users
  - Delete users
  - Dashboard statistics

- **Room/Property Management** (Owner)
  - Create, read, update, delete rooms
  - Upload room images
  - Manage availability
  - View booking requests

- **Booking System** (Client)
  - Browse available rooms
  - Book rooms
  - View booking history
  - Cancel bookings
  - Add reviews and ratings
  - Manage favorites

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create environment file**
   Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
DB_NAME=rental.db
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:3000
```

4. **Create uploads directory**

```bash
mkdir uploads
```

5. **Start the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # SQLite configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── roomController.js    # Room management logic
│   │   ├── bookingController.js # Booking logic
│   │   └── userController.js    # User management logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── roomRoutes.js        # Room endpoints
│   │   ├── bookingRoutes.js     # Booking endpoints
│   │   └── userRoutes.js        # User management endpoints
│   └── app.js                   # Express app configuration
├── uploads/                     # Uploaded images
├── .env                         # Environment variables
├── .gitignore                   # Git ignore file
├── package.json                 # Dependencies
├── server.js                    # Entry point
└── rental.db                    # SQLite database (auto-created)
```

## 🔑 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Access  | Description       |
| ------ | ----------- | ------- | ----------------- |
| POST   | `/register` | Public  | Register new user |
| POST   | `/login`    | Public  | Login user        |
| GET    | `/me`       | Private | Get current user  |
| PUT    | `/password` | Private | Update password   |
| PUT    | `/profile`  | Private | Update profile    |

### Rooms (`/api/rooms`)

| Method | Endpoint          | Access | Description                  |
| ------ | ----------------- | ------ | ---------------------------- |
| GET    | `/`               | Public | Get all rooms (with filters) |
| GET    | `/:id`            | Public | Get room by ID               |
| POST   | `/`               | Owner  | Create new room              |
| GET    | `/owner/my-rooms` | Owner  | Get owner's rooms            |
| PUT    | `/:id`            | Owner  | Update room                  |
| DELETE | `/:id`            | Owner  | Delete room                  |
| GET    | `/user/favorites` | Client | Get favorite rooms           |
| POST   | `/:id/favorite`   | Client | Add to favorites             |
| DELETE | `/:id/favorite`   | Client | Remove from favorites        |

### Bookings (`/api/bookings`)

| Method | Endpoint           | Access  | Description            |
| ------ | ------------------ | ------- | ---------------------- |
| POST   | `/`                | Client  | Create booking         |
| GET    | `/my-bookings`     | Client  | Get client's bookings  |
| GET    | `/requests`        | Owner   | Get booking requests   |
| GET    | `/:id`             | Private | Get booking details    |
| PUT    | `/:id/status`      | Owner   | Approve/reject booking |
| PUT    | `/:id/cancel`      | Client  | Cancel booking         |
| PUT    | `/:id/complete`    | Owner   | Complete booking       |
| POST   | `/:id/review`      | Client  | Add review             |
| GET    | `/stats/dashboard` | Owner   | Get owner statistics   |

### Users (`/api/users`) - Admin Only

| Method | Endpoint             | Access | Description              |
| ------ | -------------------- | ------ | ------------------------ |
| GET    | `/`                  | Admin  | Get all users            |
| GET    | `/stats/dashboard`   | Admin  | Get dashboard stats      |
| GET    | `/rooms/all`         | Admin  | Get all rooms            |
| GET    | `/bookings/all`      | Admin  | Get all bookings         |
| GET    | `/:id`               | Admin  | Get user by ID           |
| PUT    | `/:id`               | Admin  | Update user              |
| DELETE | `/:id`               | Admin  | Delete user              |
| PUT    | `/:id/toggle-status` | Admin  | Activate/deactivate user |

## 📝 Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9841234567",
  "address": "Pokhara, Nepal",
  "role": "client"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

### Create Room (Owner)

```bash
POST /api/rooms
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Cozy Studio Apartment",
  "description": "Beautiful studio near lakeside",
  "address": "Lakeside Road, Pokhara-6",
  "location": "Lakeside, Pokhara",
  "roomType": "Studio",
  "price": 15000,
  "bedrooms": 1,
  "bathrooms": 1,
  "area": 450,
  "amenities": ["wifi", "parking", "kitchen"],
  "mainImage": <file>
}
```

### Get Rooms with Filters

```bash
GET /api/rooms?location=Lakeside&roomType=Studio&minPrice=10000&maxPrice=20000&page=1&limit=12
```

### Create Booking (Client)

```bash
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "roomId": 1,
  "moveInDate": "2026-03-01",
  "moveOutDate": "2026-09-01",
  "message": "I'm interested in this property"
}
```

## 🗃️ Database Schema

### Users Table

- id, full_name, email, password, phone, address, role, is_verified, is_active, created_at, updated_at

### Rooms Table

- id, owner_id, title, description, address, location, room_type, price, bedrooms, bathrooms, area, amenities, main_image, is_available, created_at, updated_at

### Bookings Table

- id, room_id, client_id, owner_id, booking_date, move_in_date, move_out_date, status, total_price, message, created_at, updated_at

### Reviews Table

- id, room_id, client_id, rating, comment, created_at

### Favorites Table

- id, client_id, room_id, created_at

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎭 User Roles

1. **Admin** - Full system access, user management
2. **Owner** - Can list and manage properties, handle bookings
3. **Client** - Can browse rooms, book properties, add reviews

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description"
}
```

HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 🧪 Testing

Test the API health:

```bash
GET /api/health
```

Response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📦 Dependencies

- **express**: Web framework
- **sqlite3**: Database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **multer**: File upload handling
- **dotenv**: Environment variables
- **express-validator**: Input validation

## 🚀 Deployment

1. Set `NODE_ENV=production` in your environment
2. Update `JWT_SECRET` with a strong secret key
3. Configure `CLIENT_URL` for CORS
4. Ensure proper file permissions for uploads directory
5. Consider using a process manager like PM2

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@rentease.com
