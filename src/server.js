const express = require('express');
const path = require('node:path');

const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(postsRouter);
app.use(adminRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Blog app listening on port ${port}`);
});
