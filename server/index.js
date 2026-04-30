require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');

const logRoutes = require('./middle/logRoutes');
const checkAuthentication = require('./middle/checkAuthentication');

const { register, login, getMe, logout } = require('./controllers/authControllers');
const { listUsers, updateUser, deleteUser } = require('./controllers/userControllers');
const {listEvents,listUserEvents,createEvent,updateEvent,deleteEvent,} = require('./controllers/eventControllers');
const {rsvpToEvent,unrsvpFromEvent,listUserRsvps,} = require('./controllers/rsvpControllers');

const app = express();
const PORT = process.env.PORT || 8080;
const pathToFrontend = process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';

app.use(logRoutes);
app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'default-session-secret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(express.static(path.join(__dirname, pathToFrontend)));

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getMe);
app.delete('/api/auth/logout', logout);

app.get('/api/users', listUsers);
app.patch('/api/users/:user_id', checkAuthentication, updateUser);
app.delete('/api/users/:user_id', checkAuthentication, deleteUser);

app.get('/api/events', listEvents);
app.get('/api/users/:user_id/events', listUserEvents);
app.post('/api/events', checkAuthentication, createEvent);
app.patch('/api/events/:event_id', checkAuthentication, updateEvent);
app.delete('/api/events/:event_id', checkAuthentication, deleteEvent);

app.post('/api/events/:event_id/rsvps', checkAuthentication, rsvpToEvent);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, unrsvpFromEvent);
app.get('/api/users/:user_id/rsvps', listUserRsvps);

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};

app.use(handleError);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
