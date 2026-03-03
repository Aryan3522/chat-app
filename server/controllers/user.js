const User = require("../models/user");

exports.getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.userId;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } });
        res.status(200).send({ filteredUser, msg: "User For Sidebar" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findOne({ _id: userId });
        const suggestions = await User.find({
            _id: { $nin: [userId, ...user.friendRequestSent, ...user.friendRequestReceived] }
        });
        res.send(suggestions);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

exports.sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.query;
        const { userId } = req;

        await User.findByIdAndUpdate(userId, {
            $push: { friendRequestSent: receiverId }
        });

        await User.findByIdAndUpdate(receiverId, {
            $push: { friendRequestReceived: userId }
        });

        res.send("Sent!");
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" });
    }
};

exports.acceptFriendRequest = async (req, res) => {
    try {
        const { senderId } = req.query;
        const { userId } = req;

        await User.findByIdAndUpdate(senderId, {
            $pull: { friendRequestSent: userId }
        });

        await User.findByIdAndUpdate(userId, {
            $pull: { friendRequestReceived: senderId }
        });

        res.send("Added");
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal server error" });
    }
};
