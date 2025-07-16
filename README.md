## 🚀 Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT (JSON Web Tokens)

## 📋 Features

### User Roles

1. **Company HR Account**
   - Create wellness events
   - View events created by their company
   - Track event status and vendor responses

2. **Vendor Account**
   - View events assigned based on event type
   - Approve or reject events
   - Select confirmed dates from proposed options
   - Provide rejection reasons

### Event Management

- **Event Creation**: HR can create events with 3 proposed dates, location, and event type
- **Vendor Assignment**: Events are automatically assigned to vendors based on event type
- **Status Tracking**: Events can be Pending, Approved, or Rejected
- **Date Confirmation**: Vendors select one of the proposed dates when approving

## 🛠️ Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Git (for cloning the repository)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellness-event-booking
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Manual Setup (Development)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://admin:password123@localhost:27017/wellness_events?authSource=admin
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend development server**
   ```bash
   npm start
   ```

#### Database Setup

If running MongoDB manually, make sure to run the initialization script in `mongo-init/init.js` to create the pre-defined user accounts.

## 👥 Demo Accounts

The application comes with pre-created accounts for testing:

### HR Accounts
- **Username**: `hr_techcorp` | **Password**: `password123` | **Company**: TechCorp Solutions
- **Username**: `hr_innovate` | **Password**: `password123` | **Company**: Innovate Inc

### Vendor Accounts
- **Username**: `vendor_wellness` | **Password**: `password123` | **Vendor**: Wellness Pro Services
  - **Event Types**: Yoga, Meditation, Stress Management
- **Username**: `vendor_fitness` | **Password**: `password123` | **Vendor**: FitLife Training
  - **Event Types**: Fitness Training, Team Building, Health Screening
- **Username**: `vendor_mental` | **Password**: `password123` | **Vendor**: MindCare Wellness
  - **Event Types**: Mental Health Workshop, Nutrition Seminar, Stress Management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Events
- `GET /api/events` - Get events (filtered by user role)
- `POST /api/events` - Create new event (HR only)
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id/approve` - Approve event (Vendor only)
- `PUT /api/events/:id/reject` - Reject event (Vendor only)

### Users
- `GET /api/users/event-types` - Get available event types
- `GET /api/users/vendors` - Get all vendors

## 🏗️ Project Structure

```
wellness-event-booking/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   └── users.js
│   └── middleware/
│       └── auth.js
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── contexts/
│       │   └── AuthContext.js
│       ├── components/
│       │   ├── ProtectedRoute.js
│       │   └── EventDetailsModal.js
│       └── pages/
│           ├── Login.js
│           ├── HRDashboard.js
│           ├── VendorDashboard.js
│           └── CreateEvent.js
└── mongo-init/
    └── init.js
```

## 🎯 Usage Guide

### For HR Users

1. **Login** with HR credentials
2. **View Dashboard** to see all company events
3. **Create New Event** by clicking the "Create New Event" button
4. **Fill Event Details**: name, type, location, and 3 proposed dates
5. **Track Status** of submitted events in the dashboard
6. **View Details** by clicking the eye icon to see full event information

### For Vendor Users

1. **Login** with Vendor credentials
2. **View Assigned Events** based on your event types
3. **Review Event Details** by clicking the eye icon
4. **Take Action** on pending events:
   - **Approve**: Select one of the proposed dates
   - **Reject**: Provide a reason for rejection
5. **Track Processed Events** in your dashboard
