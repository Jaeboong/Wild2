const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema( {
    number: {
        type: Number,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    recommendations: {
        type: Number,
        default: 0
      },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports= mongoose.model("Post", PostSchema);