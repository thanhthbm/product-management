require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const database = require('./config/database');

const systemConfig = require('./config/system.js');
const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route.js');

database.connect();
const app = express();
const port = process.env.PORT;
app.use(methodOverride('_method'));

app.set('views', './views');
app.set('view engine', 'pug');

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

routeAdmin(app);
route(app);

app.listen(port, () => {
   console.log(`App is listening on port ${port}`);
});
