const eventModel = require('../models/eventModel');

const allowedEventTypes = [
  'conference',
  'workshop',
  'social',
  'networking',
  'concert',
  'sports',
  'fundraiser',
  'other',
];

const listEvents = async (req, res, next) => {
  try {
    const events = await eventModel.list();
    return res.send(events);
  } catch (err) {
    return next(err);
  }
};

const listUserEvents = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send({ message: 'Invalid user_id.' });
    }
    const events = await eventModel.listByUser(userId);
    return res.send(events);
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const { title, description, date, location, event_type, max_capacity } = req.body;

    if (!title || !date || !location || !event_type || max_capacity == null) {
      return res.status(400).send({ message: 'Missing required event fields.' });
    }

    if (!allowedEventTypes.includes(event_type)) {
      return res.status(400).send({ message: 'Invalid event_type.' });
    }

    if (typeof max_capacity !== 'number' || max_capacity <= 0) {
      return res.status(400).send({ message: 'Invalid max_capacity.' });
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
  } catch (err) {
    return next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const eventId = Number(req.params.event_id);
    const { title, description, date, location, event_type, max_capacity } = req.body;

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).send({ message: 'Invalid event_id.' });
    }

    if (
      title === undefined &&
      description === undefined &&
      date === undefined &&
      location === undefined &&
      event_type === undefined &&
      max_capacity === undefined
    ) {
      return res.status(400).send({ message: 'At least one field is required to update.' });
    }

    if (event_type !== undefined && !allowedEventTypes.includes(event_type)) {
      return res.status(400).send({ message: 'Invalid event_type.' });
    }

    if (max_capacity !== undefined && (typeof max_capacity !== 'number' || max_capacity <= 0)) {
      return res.status(400).send({ message: 'Invalid max_capacity.' });
    }

    const existingEvent = await eventModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).send({ message: 'Event not found.' });
    }

    if (existingEvent.user_id !== userId) {
      return res.status(403).send({ message: 'You are not the owner of this event.' });
    }

    const event = await eventModel.update(
      eventId,
      title,
      description,
      date,
      location,
      event_type,
      max_capacity,
      userId
    );

    return res.send(event);
  } catch (err) {
    return next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const eventId = Number(req.params.event_id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).send({ message: 'Invalid event_id.' });
    }

    const existingEvent = await eventModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).send({ message: 'Event not found.' });
    }

    if (existingEvent.user_id !== userId) {
      return res.status(403).send({ message: 'You are not the owner of this event.' });
    }

    const deleted = await eventModel.destroy(eventId, userId);
    return res.send(deleted);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listEvents,
  listUserEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
