const mongoose = require('mongoose');

const userSchema1 = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName: {
        type: String,
    },
    collegeName: {
        type: String,

    }
   ,  rollNumber: {
    type: String,

}

});

module.exports = mongoose.model('User2', userSchema1);