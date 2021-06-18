const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        require: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    state: {
        type: String
    },
    productDetails: [{
        productName: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    pointToRemember: {
        type: String,
        required: true
    },
    status: {
        type: String,
        require: true,
        default: 'pending'
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Invoice', invoiceSchema);
