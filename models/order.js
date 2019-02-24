const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema ({
    index: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        require: true,
    },
    status: {
        type: String,
        require: true,
    },
    products: {
        type: Array,
        require: true,
    },
    totalPrice: {
        type: Number,
        require: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: `User`,
        require: true,
    }
});

module.exports = mongoose.model(`Order`, orderSchema);