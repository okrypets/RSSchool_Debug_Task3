var http = require('http');
var express = require('express');
var app = express();
const db = require('./db').sequelize; 
var user = require('./controllers/usercontroller');
var game = require('./controllers/gamecontroller')

const hostname = process.env.DB_HOST;
const port = process.env.PORT;

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  console.log(`Server running at http://${hostname}:${port}/`);
  res.end();
})

db.sync();

app.use(express.urlencoded({
  extended: true
}));

app.use(express.json());

app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);

app.listen(port, () => {
  console.log("App is listening on 4000");
});


module.exports = app
