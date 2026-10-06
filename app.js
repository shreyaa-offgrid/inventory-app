const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const morgan = require('morgan');
const usersRouter = require('./routes/usersRouter');

app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/', usersRouter);

const port = 3000;
app.listen(port,()=>{
  console.log(`server listening on port ${port}`);
})