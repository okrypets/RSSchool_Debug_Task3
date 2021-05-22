const http = require('http');
const express = require('express');
const app = express();
const { sequelize } = require('./db'); 
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller')

const hostname = process.env.DB_HOST;
const port = process.env.PORT;

http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  console.log(`Server running at http://${hostname}:${port}/`);
  res.end();
})

sequelize.sync();

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
