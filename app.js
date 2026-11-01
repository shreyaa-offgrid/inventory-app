const express = require('express');
const morgan = require('morgan');

const indexRouter = require('./routes/indexRouter');
const categoryRouter = require('./routes/categoryRouter');
const productRouter = require('./routes/productRouter');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(morgan('dev'));

app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

app.use((req, res)=>{
  res.status(400).send('Page not found');
});

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).send('Something went wrong');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`server listening on port ${PORT}`);
})