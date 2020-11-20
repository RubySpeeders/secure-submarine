const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('req.user:', req.user);
  const queryText = `SELECT *
  FROM "user"
  JOIN "secret" ON "user".clearance_level > "secret".secrecy_level
  WHERE "user".clearance_level >= "secret".secrecy_level
  ORDER BY username ASC;`;
  pool
    .query('SELECT * FROM "secret";')
    .then((results) => res.send(results.rows))
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
