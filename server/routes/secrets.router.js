const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
  console.log('req.user:', req.user);
  const queryUserRole = `SELECT * FROM "user" where id=$1`;
  pool
    .query(queryUserRole, [req.user.id])
    .then((response) => {
      const clearanceLevel = response.rows[0].clearance_level;
      const queryText = `SELECT * FROM "secret"
    WHERE "secret".secrecy_level <= $1
    ORDER BY id ASC;`;
      pool.query(queryText, [clearanceLevel]).then((response) => {
        res.send(response.rows).catch((error) => {
          console.log('Error in the inner pool:', error);
          res.sendStatus(500);
        });
      });
    })
    .catch((error) => {
      console.log('Error making SELECT for secrets:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
