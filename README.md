# Book-Search-Engine

## Overview
The Book Search Engine is a web application built with React for the frontend, Apollo Server for GraphQL API, and MongoDB for data storage. It allows users to search for books using the Google Books API, save books to their account, and manage their saved books list.


## Features
- Search for Books: 
    - Users can search for books using keywords. Search results display book titles, authors, descriptions, and links to Google Books.

- User Authentication: 
    - Secure signup and login functionalities using JWT authentication.

- Save and Manage Books: 
    - Logged-in users can save books to their account and manage their saved books list (view, remove).

## Technologies Used
- Frontend: React, Apollo Client, HTML, CSS
- Backend: Apollo Server, GraphQL, Node.js, Express.js
- Database: MongoDB
- Authentication: JSON Web Tokens (JWT)
- Deployment: Render

## Setup Instructions
- Prerequisites
    - Node.js installed on your machine
    - MongoDB instance (local or cloud-based)
    - Google Books API key (optional for search functionality)

- Installation
    1. Clone the repository
    2. Install dependencies for both frontend and backend
    3. set up enviorment variables
        - Create a .env file in the server directory with the following variables:
            - PORT=4000
            - MONGODB_URI=mongodb://localhost:27017/booksearch
            - JWT_SECRET=your_jwt_secret
        - Replace MONGODB_URI with your MongoDB connection string and JWT_SECRET with your preferred JWT secret key.
- Running the Application
    1.Start the backend Apollo Server
    2. Start the frontend React application
    3. Open your browser and go to http://localhost:3000 to view the application.
- Deployment on Render
    1. Create a new Web Service on Render.
    2.Connect your GitHub repository for automatic deployments.
    3. Configure the following environment variables in Render dashboard:
        - PORT: Set to 4000 (or your preferred port).
        - MONGODB_URI: Your MongoDB connection string.
        - JWT_SECRET: Your JWT secret key.
    4. Set the following build and start commands in Render:
        - Build Command: npm install && npm run build
        - Start Command: node server/server.js
    5. Deploy your service on Render. Once deployed, your application will be accessible via the Render provided URL.

## Licence
This project is licensed under the MIT License - see the LICENSE file for details.
