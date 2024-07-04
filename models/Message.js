const mongoose = require('mongoose');

const createMessageModel = (roomId) => {
    const modelName = `messages_${roomId}`;

    if (mongoose.models[modelName]) {
        return mongoose.models[modelName];
    }

    const messageSchema = new mongoose.Schema({
        roomId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    });

    return mongoose.model(modelName, messageSchema);
}

module.exports = createMessageModel;
