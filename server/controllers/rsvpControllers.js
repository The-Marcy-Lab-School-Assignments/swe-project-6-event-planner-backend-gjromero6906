const rsvpModel = require('../models/rsvpModel');

const rsvpToEvent = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const eventId = Number(req.params.event_id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).send({ message: 'Invalid event_id.' });
    }

    const created = await rsvpModel.create(userId, eventId);
    return res.status(201).send(created || null);
  } catch (err) {
    return next(err);
  }
};

const unrsvpFromEvent = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const eventId = Number(req.params.event_id);

    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).send({ message: 'Invalid event_id.' });
    }

    const deleted = await rsvpModel.destroy(userId, eventId);
    return res.send(deleted || null);
  } catch (err) {
    return next(err);
  }
};

const listUserRsvps = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).send({ message: 'Invalid user_id.' });
    }

    const events = await rsvpModel.listByUser(userId);
    return res.send(events);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  rsvpToEvent,
  unrsvpFromEvent,
  listUserRsvps,
};
