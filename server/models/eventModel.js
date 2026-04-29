const pool = require('../db/pool');

module.exports.list = async () => {
  const query = `
    SELECT
      events.event_id,
      events.title,
      events.description,
      events.event_date AS date,
      events.location,
      events.event_type,
      events.max_capacity,
      events.user_id,
      users.username,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    GROUP BY events.event_id, users.username
    ORDER BY events.event_id
  `;
  const { rows } = await pool.query(query);
  return rows;
};

module.exports.listByUser = async (user_id) => {
  const query = `
    SELECT
      events.event_id,
      events.title,
      events.description,
      events.event_date AS date,
      events.location,
      events.event_type,
      events.max_capacity,
      events.user_id,
      users.username,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    WHERE events.user_id = $1
    GROUP BY events.event_id, users.username
    ORDER BY events.event_date
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

module.exports.create = async (
  user_id,
  title,
  description,
  event_date,
  location,
  event_type,
  max_capacity
) => {
  const query = `
    INSERT INTO events (
      title,
      description,
      event_date,
      location,
      event_type,
      max_capacity,
      user_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING event_id, title, description, event_date AS date, location, event_type, max_capacity, user_id
  `;
  const { rows } = await pool.query(query, [
    title,
    description,
    event_date,
    location,
    event_type,
    max_capacity,
    user_id,
  ]);
  return rows[0];
};

module.exports.update = async (
  event_id,
  title,
  description,
  event_date,
  location,
  event_type,
  max_capacity,
  user_id
) => {
  const query = `
    UPDATE events
    SET title = $1,
        description = $2,
        event_date = $3,
        location = $4,
        event_type = $5,
        max_capacity = $6
    WHERE event_id = $7
      AND user_id = $8
    RETURNING event_id, title, description, event_date AS date, location, event_type, max_capacity, user_id
  `;
  const { rows } = await pool.query(query, [
    title,
    description,
    event_date,
    location,
    event_type,
    max_capacity,
    event_id,
    user_id,
  ]);
  return rows[0] || null;
};

module.exports.destroy = async (event_id, user_id) => {
  const query = `
    DELETE FROM events
    WHERE event_id = $1
      AND user_id = $2
    RETURNING event_id
  `;
  const { rows } = await pool.query(query, [event_id, user_id]);
  return rows[0] || null;
};