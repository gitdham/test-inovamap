const Pool = require('pg').Pool

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'test_inovamap_db',
  password: 'postgreadmin',
  port: 5432
})

pool.connect((err) => { if (err) throw err })

module.exports = pool
