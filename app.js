const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const { expressjwt: jwt } = require("express-jwt");
const api = process.env.API_URL;

//middleware
app.use(cors());
app.options('*',cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
//app.use(authJwt());
//app.use(errorHandler);
app.use(
    jwt({
      secret: process.env.secret,
      algorithms: ["HS256"],
      //isRevoked: isRevoked
    })
    .unless({ 
        path: [
            {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']},
            '/api/v1/users/login',
            '/api/v1/users/register',
            '/api/v1/users'
        ] 
    })
  );
//   async function isRevoked(req, payload, done) {
//     if (!payload.isAdmin) {
//         done(null, true)
//     }
//     done();
//   }
  

//All Routes--------------------------------------------------
const categoriesRoutes = require('./routers/categories');
const productsRoutes = require('./routers/products');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');



app.use(api+'/categories', categoriesRoutes);
app.use(api+'/products', productsRoutes);
app.use(api+'/users', usersRoutes);
app.use(api+'/orders', ordersRoutes);
//All routes---------------------------------------------------

//Database-------------------------------------------------
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    dbName : 'myShop'
})
.then(()=> {
    console.log('database connection is ready...');
})
.catch((err) => {
    console.log(err);
})
//Database-------------------------------------------------

//development Server---------------------------------------------------
// app.listen(3000,()=>{
    
//     console.log('server is running on the Port http://localhost:3000');
// })
//Server---------------------------------------------------

//-Production-Server-----------------------------------------------
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port)
})
