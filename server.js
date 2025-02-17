const express = require('express');

const UsersRouter = require('./users/userRouter')

const server = express();

server.use(express.json(), logger)
server.use('/users', UsersRouter)







server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
};






module.exports = server;
