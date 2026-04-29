// db/seed.js
const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
    await pool.query('DROP TABLE IF EXISTS rsvps');
    await pool.query('DROP TABLE IF EXISTS events'); 
    await pool.query('DROP TABLE IF EXISTS users');

    await pool.query(`
        CREATE TABLE users (
            user_id       SERIAL PRIMARY KEY,
            username      TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        );
    `);

    await pool.query(`
        CREATE TABLE events (
            event_id       SERIAL PRIMARY KEY,
            title          TEXT NOT NULL,
            description    TEXT,
            event_date     TEXT NOT NULL,
            location       TEXT NOT NULL,
            event_type     TEXT NOT NULL,
            max_capacity   INTEGER NOT NULL,
            user_id        INTEGER REFERENCES users(user_id) ON DELETE CASCADE
        );
    `);

    await pool.query(`
        CREATE TABLE rsvps (
            rsvp_id  SERIAL PRIMARY KEY,
            user_id  INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
            event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
            UNIQUE (user_id, event_id)
        );
    `);

    const insertUserSql = 'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id;';
    const aliceHash = await bcrypt.hash('password123', SALT_ROUNDS);
    const bobHash = await bcrypt.hash('securepass', SALT_ROUNDS);
    const carolHash = await bcrypt.hash('guestpass', SALT_ROUNDS);

    const aliceResponse = await pool.query(insertUserSql, ['alice', aliceHash]);
    const bobResponse = await pool.query(insertUserSql, ['bob', bobHash]);
    const carolResponse = await pool.query(insertUserSql, ['carol', carolHash]);

    const aliceId = aliceResponse.rows[0].user_id;
    const bobId = bobResponse.rows[0].user_id;
    const carolId = carolResponse.rows[0].user_id;

    const insertEventSql = `
        INSERT INTO events (title, description, event_date, location, event_type, max_capacity, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING event_id;
    `;

    const eventOne = await pool.query(insertEventSql, [
        'Community Game Night',
        'Board games, snacks, and friendly competition.',
        '2026-05-15',
        'Community Center',
        'Social',
        30,
        aliceId,
    ]);

    const eventTwo = await pool.query(insertEventSql, [
        'Planning Workshop',
        'Interactive session on event planning and coordination.',
        '2026-06-02',
        'City Library',
        'Workshop',
        20,
        bobId,
    ]);

    const eventOneId = eventOne.rows[0].event_id;
    const eventTwoId = eventTwo.rows[0].event_id;

    const insertRsvpSql = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2);';
    await pool.query(insertRsvpSql, [bobId, eventOneId]);
    await pool.query(insertRsvpSql, [carolId, eventOneId]);
    await pool.query(insertRsvpSql, [aliceId, eventTwoId]);

    return {
        users: [
            { username: 'alice' },
            { username: 'bob' },
            { username: 'carol' },
        ],
        events: [
            { title: 'Community Game Night' },
            { title: 'Planning Workshop' },
        ],
    };
}

seed()
    .then(({ users, events }) => {
        console.log('Database seeded successfully.');
        console.log(`  Users: ${users.map((u) => u.username).join(', ')}`);
        console.log(`  Events: ${events.map((e) => e.title).join(', ')}`);
    })
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());
