const {Pool} = require('pg');

module.exports = new Pool({
  host:"localhost",
  user:"shreya_singh",
  database:"top_users",
  password:"theblackparade",
  port:5432
})

/* 
module.exports = new Pool({
  connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users"
});
*/