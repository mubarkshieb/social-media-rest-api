const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    media: {
        type: Array,
        default: []
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', postSchema);