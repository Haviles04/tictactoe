const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name']  
    },
    p0: {
        type: Number,
    },
    p1: {
        type: Number,
    },
    p0Boxes: {
        type: Array,
        default: []
    },
    p1Boxes: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Game', gameSchema);