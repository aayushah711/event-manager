# Event Management Platform

## Description

This is a backend system for a virtual event management platform focusing on user registration, event scheduling, and participant management. The system includes secure user authentication, event creation, updation, deletion, and participant registration. It uses bcrypt for password hashing, JWT for session management, and SendGrid for sending emails.

## Features

- User registration and login with JWT authentication
- Event creation, updation, and deletion by authorized users
- Event registration for participants
- Email notifications on successful registration
- Retries for email not sent

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt for password hashing
- JWT for session management
- SendGrid for sending emails
- Joi for validation

## Setup and Installation

### Prerequisites

- Node.js installed
- MongoDB installed and running
- SendGrid credentials (api key, authenticated sender email)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/aayushah711/event-manager.git
   cd event-manager
   ```
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
   ```
   PORT=3000
   API_SECRET="api_secret"
   MONGODB_URI="mongodb://localhost:27017/event-manager-db"
   TEST_MONGODB_URI="mongodb://localhost:27017/event-manager-test-db"
   USER_EMAIL="authenticated_sender_email"
   SENDGRID_API_KEY="sendgrid_api_key"
   ```
4. Start the server: `node app.js`

## API Endpoints

### User Registration

- Endpoint: `POST /register`
- Description: Register a new user.
- Request Body:

  ```
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "organizer"
  }
  ```

- Response:
  201 Created:

  ```
  {
    "message": "User registered successfully"
  }

  ```

  400 Bad Request:

  ```
  {
    "error": "Validation error details"
  }
  ```

### User Login

- Endpoint: `POST /login`
- Description: Log in a user.
- Request Body:

  ```
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- Response:
  200 OK:

  ```
  {
    "token": "jwt_token"
  }
  ```

  400 Bad Request:

  ```
  {
    "error": "Invalid credentials"
  }
  ```

### Create Event

- Endpoint: `POST /events`
- Description: Create a new event.
- Request Headers:

  ```
  Authorization: Bearer jwt_token
  ```

- Request Body:

  ```
  {
    "title": "Event Title",
    "description": "Event Description",
    "date": "2024-06-01",
    "time": "18:00"
  }
  ```

  Response:
  201 Created:

  ```
  {
    "message": "Event created successfully",
    "event": {
        "id": "event_id",
        "title": "Event Title",
        "description": "Event Description",
        "date": "2024-06-01",
        "time": "18:00",
        "participants": []
    }
  }
  ```

  400 Bad Request:

  ```
  {
    "error": "Validation error details"
  }

  ```

### Update Event

- Endpoint: `PUT /events/:id`
- Description: Update an event.
- Request Headers:

  ```
  Authorization: Bearer jwt_token
  ```

- Request Body:

  ```
  {
    "title": "Updated Event Title",
    "description": "Updated Event Description",
    "date": "2024-06-02",
    "time": "19:00"
  }
  ```

  Response:
  200 OK:

  ```
  {
    "message": "Event updated successfully",
    "event": {
        "id": "event_id",
        "title": "Updated Event Title",
        "description": "Updated Event Description",
        "date": "2024-06-02",
        "time": "19:00",
        "participants": []
    }
  }
  ```

  404 Not Found:

  ```
  {
    "error": "Event not found"
  }
  ```

### Delete Event

- Endpoint: `DELETE /events/:id`
- Description: Delete an event.
- Request Headers:

  ```
  Authorization: Bearer jwt_token
  ```

- Response:

  204 No Content

  404 Not Found:

  ```
  {
    "error": "Event not found"
  }
  ```

### Get All Events

- Endpoint: `GET /events`
- Description: Get a list of all events.
- Request Headers (optional):

  ```
  Authorization: Bearer jwt_token
  ```

- Response:
  200 OK:

  ```
  [
    {
        "id": "event_id",
        "title": "Event Title",
        "description": "Event Description",
        "date": "2024-06-01",
        "time": "18:00",
        "participants": [],
        "hasParticipated": true
    },
    {
        "id": "event_id_2",
        "title": "Another Event Title",
        "description": "Another Event Description",
        "date": "2024-06-02",
        "time": "19:00",
        "participants": [],
        "hasParticipated": false
    }
  ]
  ```

### Register for an Event

- Endpoint: `POST /events/:id/register`
- Description: Register for an event.
- Request Headers:

  ```
  Authorization: Bearer jwt_token
  ```

- Response:
  200 OK:

  ```
  {
    "message": "Successfully registered for the event"
  }
  ```

  404 Not Found:

  ```
  {
    "error": "Event not found"
  }
  ```

  400 Bad Request:

  ```
  {
    "error": "User already registered"
  }
  ```

### Get User's Events

- Endpoint: `GET /user/events`
- Description: Get all events the user has registered for.
- Request Headers:

  ```
  Authorization: Bearer jwt_token
  ```

- Response:
  200 OK:

  ```
  [
    {
        "id": "event_id",
        "title": "Event Title",
        "description": "Event Description",
        "date": "2024-06-01",
        "time": "18:00",
        "participants": []
    },
    {
        "id": "event_id_2",
        "title": "Another Event Title",
        "description": "Another Event Description",
        "date": "2024-06-02",
        "time": "19:00",
        "participants": []
    }
  ]
  ```

## Email Sending with Retry Mechanism

The `sendEmailWithRetry` function implements a retry mechanism to handle transient errors when sending emails. This ensures that temporary issues with the email service do not prevent emails from being sent.
