const db = require('../db/queries')

async function getUsernames(req, res){
  const usernames = await db.getAllUsernames();
  res.send('usernames: ' + usernames.map(user=>user.username).join(","));
}

module.exports = {getUsernames};