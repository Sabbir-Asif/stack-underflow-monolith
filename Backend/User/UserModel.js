const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String
    }
});

const User = mongoose.model('StackUser',userSchema);

module.exports = User;