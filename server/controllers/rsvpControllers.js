const rsvpModel = require('../models/rsvpModel');

const rsvpToEvent = async (req, res) => {
  const userId = req.session.userId;
  const eventId = Number(req.params.event_id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).send({ message: 'Invalid event_id.' });
  }

  await rsvpModel.create(userId, eventId);
  return res.status(201).send({ message: 'RSVP added.' });
};

const unrsvpFromEvent = async (req, res) => {
  const userId = req.session.userId;
  const eventId = Number(req.params.event_id);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).send({ message: 'Invalid event_id.' });
  }

  const deleted = await rsvpModel.destroy(userId, eventId);
  if (!deleted) {
    return res.status(404).send({ message: 'RSVP not found.' });
  }

  return res.send({ message: 'RSVP removed.' });
};

const listUserRsvps = async (req, res) => {
  const userId = Number(req.params.user_id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).send({ message: 'Invalid user_id.' });
  }

  const events = await rsvpModel.listByUser(userId);
  return res.send(events);
};

module.exports = {
  rsvpToEvent,
  unrsvpFromEvent,
  listUserRsvps,
};
