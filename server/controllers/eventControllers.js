const eventModel = require('../models/eventModel');

const listEvents = async (req, res) => {
  const events = await eventModel.list();
  return res.send(events);
};

const listUserEvents = async (req, res) => {
  const userId = Number(req.params.user_id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).send({ message: 'Invalid user_id.' });
  }
  const events = await eventModel.listByUser(userId);
  return res.send(events);
};

const createEvent = async (req, res) => {
  const userId = req.session.userId;
  const { title, description, date, location, event_type, max_capacity } = req.body;

  if (!title || !date || !location || !event_type || max_capacity == null) {
    return res.status(400).send({ message: 'Missing required event fields.' });
  }

  const event = await eventModel.create(
    userId,
    title,
    description || null,
    date,
    location,
    event_type,
    max_capacity
  );
  return res.status(201).send(event);
};

const updateEvent = async (req, res) => {
  const userId = req.session.userId;
  const eventId = Number(req.params.event_id);
  const { title, description, date, location, event_type, max_capacity } = req.body;

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).send({ message: 'Invalid event_id.' });
  }

  const event = await eventModel.update(
    eventId,
    title,
    description || null,
    date,
    location,
    event_type,
    max_capacity,
    userId
  );

  if (!event) {
    return res.status(404).send({ message: 'Event not found or not owned by user.' });
  }

  return res.send(event);
};

const deleteEvent = async (req, res) => {
  const userId = req.session.userId;
  const eventId = Number(req.params.event_id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).send({ message: 'Invalid event_id.' });
  }

  const deleted = await eventModel.destroy(eventId, userId);
  if (!deleted) {
    return res.status(404).send({ message: 'Event not found or not owned by user.' });
  }

  return res.send({ message: 'Event deleted.' });
};

module.exports = {
  listEvents,
  listUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
