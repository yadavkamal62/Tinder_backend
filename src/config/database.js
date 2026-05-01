const mongoose = require('mongoose');
const connectDB = async () => {

    await mongoose.connect(
        "mongodb+srv://kamalyadav:kamal yadav 2013@namastenode.kowyiky.mongodb.net/devTinder"
    );

};
module.exports = connectDB;

