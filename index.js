require('dotenv').config();
const express = require('express');
const route = require('./routes/client/index.route.js');
const app = express();
const port = process.env.PORT;


app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));
route(app);

app.listen(port, () => {
   console.log(`App is listening on port ${port}`);
});
