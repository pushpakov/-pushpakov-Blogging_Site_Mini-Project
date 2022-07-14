/*------------------------------------------Import Modules:-------------------------------------------*/
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/routes.js');
const mongoose = require('mongoose');
const app = express();

/*------------------------------------------Bind Application Level Middleware:-------------------------------------------*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*------------------------------------------Connecting Data-Base:-------------------------------------------*/
mongoose.connect("mongodb+srv://pushpak:pushpak1819@radoncluster.opqe2.mongodb.net/Blog_Project?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)

/*------------------------------------------Binding Connecting on port:-------------------------------------------*/
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});