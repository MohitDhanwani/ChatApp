// RoomRoute.js
const express = require('express');
const RoomSchema = require('../models/Rooms.js');
const {checkAuth} = require('../middleware/AuthMiddleware.js');
const route = express.Router();

route.post('/create', checkAuth, async (req, res) => {
    const { roomName, password, description } = req.body;

    try {
        const room = await RoomSchema.create({
            roomName,
            password,
            description,
            createdBy : req.user.userID,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

route.post('/join', async (req, res) => {

    const { roomName, password } = req.body;
    const room = await RoomSchema.findOne({ roomName, password });

});

route.get('/allRooms' , async (req,res) => {

    const allRooms = await RoomSchema.find({});
    return res.json(allRooms);
})

route.post("/auth/check", async (req, res) => {
    const { roomName, password } = req.body;

    try {
        const room = await RoomSchema.findOne({ roomName, password });

        if (!room) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({  roomId: room._id , createdby : room.createdBy  });
    } catch (error) {
        console.error("Error checking room authentication:", error);
        res.status(500).json({ error: "Server error" });
    }
});

route.delete('/delete/:roomID', checkAuth, async (req, res) => {
    const { roomID } = req.params;

    try {
        const room = await RoomSchema.findById(roomID);

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        if (room.createdBy.toString() !== req.user.userID) {
            return res.status(403).json({ error: "You are not authorized to delete this room" });
        }

        await RoomSchema.deleteOne({ _id: roomID });
        res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = route;
