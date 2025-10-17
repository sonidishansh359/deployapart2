# TODO for MERN Stack Login Form with Signup

## Backend Setup
- [x] Create backend/package.json with dependencies: express, mongoose, cors, bcryptjs
- [x] Create backend/server.js: Set up Express server, connect to MongoDB (hardcoded URL), enable CORS
- [x] Create backend/models/Pass.js: Mongoose schema for username (unique) and password (hashed)
- [x] Create backend/routes/auth.js: POST /login endpoint to verify username and password using bcrypt
- [x] Add POST /register endpoint in auth.js for signup (hash password and save user)
- [x] Install backend dependencies (npm install in backend)

## Frontend Setup
- [x] Install axios in frontend
- [x] Update frontend/src/App.js: Create a very stylish login/signup form with toggle, username, password fields, submit buttons, and API calls to backend /login and /register. Use modern CSS with gradients, shadows, animations.

## Testing
- [ ] Run backend server (npm start in backend)
- [ ] Run frontend (npm start in frontend)
- [ ] Test login and signup functionality
