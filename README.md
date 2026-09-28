Feedants Competition Details - Full Stack Assignment

A functional full-stack Competition Details module built for the Feedants Full Stack Development Internship Technical Assignment.

Tech Stack

Mobile

React Native

Expo

React Navigation

Backend

Node.js

Express.js

MongoDB

Mongoose

Features

Dynamic competition details loaded from the backend

Competition availability and remaining spots

User-specific registration state

Registration validation

Registration closing date validation

Competition lifecycle handling

Atomic spot reservation

Protection against overbooking during concurrent registrations

User registration details

Competition submission lifecycle

Submission start/end date validation

User-specific submission state

Duplicate submission protection

MongoDB persistence

React Native mobile UI

API-based frontend/backend communication

Project Structure

Feedants-Assignment/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── mobile/
│   ├── screens/
│   ├── services/
│   ├── assets/
│   ├── App.js
│   ├── app.json
│   └── package.json
├── .gitignore
└── README.md

Prerequisites

Node.js

npm

MongoDB Atlas account

Expo Go mobile application

Backend Setup

cd backend
npm install

Create backend/.env:

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

Start the backend:

npm run dev

Backend:

http://localhost:5000

Mobile Setup

cd mobile
npm install

For physical-device testing, update the API base URL in mobile/services/api.js:

const API_BASE_URL = "http://YOUR_COMPUTER_IP:5000/api";

Make sure the phone and computer are on the same Wi-Fi network.

Start Expo:

npx expo start

Scan the QR code using Expo Go.

API Endpoints

Competition

GET /api/competitions
GET /api/competitions/:id

Registration

POST /api/registrations
GET /api/registrations/competition/:competitionId
GET /api/registrations/competition/:competitionId/user/:userId

Submission

POST /api/submissions
GET /api/submissions/competition/:competitionId/user/:userId

Important Assumptions

Authentication

Authentication was not explicitly required by the assignment.

For this prototype, a temporary development user identifier is used to demonstrate user-specific registration and submission state.

In a production application, this would be replaced with the authenticated user's unique ID from an authentication system.

Payment

Payment processing is outside the scope of this assignment. Registration records maintain a payment status field for future integration.

Submission

The prototype accepts a submission URL instead of implementing file storage. A production system could additionally support video/file uploads through object storage.

Major Technical Decisions

Atomic Competition Spot Reservation

Competition spots are reserved using an atomic MongoDB update with the capacity condition:

bookedSpots < totalSpots

combined with $inc.

This prevents concurrent users from exceeding competition capacity.

Unique Registration Constraint

A compound unique index is used on:

competitionId + userId

This prevents duplicate registrations for the same competition and user.

Unique Submission Constraint

A compound unique index is used on:

competitionId + userId

This ensures that a user cannot submit multiple entries for the same competition.

Backend Validation

Important business rules are enforced on the backend:

Competition must exist

Competition must be open

Registration deadline must not have passed

Competition must have available spots

User must be registered before submitting

Submission period must be active

Duplicate registrations are rejected

Duplicate submissions are rejected

Submission URL must be valid

Concurrency and Data Consistency

The application assumes that many users may attempt to register at the same time.

Competition capacity is not handled by reading and incrementing bookedSpots as separate operations. Instead, the database performs the capacity check and increment atomically.

This helps prevent overbooking under concurrent requests.

Trade-offs

Temporary User Identifier

A real authentication system would provide stronger user identity management, but authentication was outside the explicit assignment requirements.

A temporary user identifier was therefore used to focus on the competition workflow.

URL Submission

The prototype accepts a submission URL instead of implementing file storage. This keeps the assignment focused on competition business logic while leaving room for production storage integration.

Local Network API

The React Native application currently uses the developer machine's local network IP for physical-device testing.

A production application would use environment-based configuration and a deployed HTTPS API.

Production Improvements

If developed further for production:

User authentication and authorization

Secure user identity handling

Payment gateway integration

Cloud object storage for submissions

HTTPS deployment

Environment-based API configuration

Rate limiting

Request validation middleware

Centralized error handling

Logging and monitoring

Automated tests

CI/CD pipeline

API documentation

Database monitoring and optimization

Redis/caching where appropriate

Scalable cloud deployment

Admin dashboard

Proper competition status scheduling

File type and size validation for uploaded submissions

Testing

The registration flow was tested with multiple simultaneous registration requests to verify that the competition does not exceed its available capacity.

The submission flow was tested for:

Registered user submission

Submission persistence

Duplicate submission prevention

Submission start date

Submission end date

Refresh/reload persistence

Assignment Scope

This project was developed according to the Feedants Technical Assignment requirements:

React Native frontend

Node.js + Express.js backend

MongoDB database

Dynamic competition data

User participation state

Competition lifecycle

Remaining spots

Time-dependent behavior

Backend validation

Business rules

Concurrent user consistency