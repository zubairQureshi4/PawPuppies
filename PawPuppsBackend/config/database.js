const mogoose = require('mongoose');
const dotenv = require('dotenv').config();

module.exports = () => {
   mogoose.connect(process.env.DB_CON_STRING)
        .then(() => console.log('DB Connection Successfull'))
        .catch(err => console.log(err.message))
}