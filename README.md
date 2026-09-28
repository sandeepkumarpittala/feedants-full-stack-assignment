# Feedants Competition Details - Full Stack Assignment

A functional full-stack Competition Details module built for the Feedants Full Stack Development Internship Technical Assignment.

## Tech Stack

### Mobile
- React Native
- Expo
- React Navigation

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Features

- Dynamic competition details loaded from the backend
- Competition availability and remaining spots
- User-specific registration state
- Registration validation
- Registration closing date validation
- Competition lifecycle handling
- Atomic spot reservation
- Protection against overbooking during concurrent registrations
- User registration details
- Competition submission lifecycle
- Submission start/end date validation
- User-specific submission state
- Duplicate submission protection
- MongoDB persistence
- React Native mobile UI
- API-based frontend/backend communication

## Project Structure

```text
Feedants-Assignment/
│
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
│
├── mobile/
│   ├── screens/
│   ├── services/
│   ├── assets/
│   ├── App.js
│   ├── app.json
│   └── package.json
│
├── .gitignore
└── README.md