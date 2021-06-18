const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.json')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    invoice: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Invoice'
        }
    ]
});

userSchema.methods.generateToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, role: this.role }, config.secret, { expiresIn: '1h' });
        return token;
    }
    catch (error) {
        console.log(error);
    }
}


module.exports = mongoose.model('User', userSchema);