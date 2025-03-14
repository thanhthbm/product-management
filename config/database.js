const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connect succeed!');
    } catch (error) {
        console.log('Connect failed!');
    }
}

