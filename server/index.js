require('dotenv').config();
const express = require('express');
const cookieSession = require('cookie-session');
const path = require('path');
const checkAuthentication = require('./middle/checkAuthentication');
const {
  listEvents,
  listUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('./controllers/eventControllers');
const {
  rsvpToEvent,
  unrsvpFromEvent,
  listUserRsvps,
} = require('./controllers/rsvpControllers');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'default-session-secret'],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.get('/api/events', listEvents);
app.get('/api/users/:user_id/events', listUserEvents);
app.post('/api/events', checkAuthentication, createEvent);
app.patch('/api/events/:event_id', checkAuthentication, updateEvent);
app.delete('/api/events/:event_id', checkAuthentication, deleteEvent);

app.post('/api/events/:event_id/rsvps', checkAuthentication, rsvpToEvent);
app.delete('/api/events/:event_id/rsvps', checkAuthentication, unrsvpFromEvent);
app.get('/api/users/:user_id/rsvps', listUserRsvps);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
