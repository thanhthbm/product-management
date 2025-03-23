require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const database = require('./config/database');
const flash = require('express-flash');
const systemConfig = require('./config/system.js');
const routeAdmin = require('./routes/admin/index.route');
const route = require('./routes/client/index.route.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
database.connect();
const app = express();
const port = process.env.PORT;

//override post method to other method
app.use(methodOverride('_method'));
//parser body for form submitted
app.use(bodyParser.urlencoded({extended: false}));

//pug template
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//flash to show notification
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));

routeAdmin(app);
route(app);

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
