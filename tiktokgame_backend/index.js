const { WebcastPushConnection } = require('tiktok-live-connector');
const express = require('express');
const cors = require('cors');
const app = express();
const FRONT_PORT = 3000
const BACK_PORT = 3001
app.use(cors({
    origin: `http://localhost:${FRONT_PORT}`,
    credentials: true
}));
const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
//const io = socketio(server);
const io = new socketio.Server(server, {
    cors: {
        origin: `http://localhost:${FRONT_PORT}`,
        methods: ["GET", "POST"],
        credentials: true
    }
});



// Connect to tik tok live
app.get('/api/connectTiktok', (req, res) => {
    const username = req.query.username;
    connectTiktok(username, res)

});

function connectTiktok(username, res) {
    const tiktokLiveConnection = new WebcastPushConnection(username, {processInitialData: false});

    tiktokLiveConnection.connect().then(state => {
        res.status(200).send('Successfully connected to tik tok live');
        console.info(`Connected to roomId ${state.roomId}`);
    }).catch(err => {
        res.status(500).send('Failed to connect to Tiktok live');
        console.error('Failed to connect', err);
    })

    // Define the events that you want to handle
    // listen to chat messages (comments)
    tiktokLiveConnection.on('chat', data => {
        console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
        io.emit('chatMessage', data);
    })

    // Listen to gifts 
    tiktokLiveConnection.on('gift', data => {
        console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
        io.emit('gift', data);
    })

    
    // Listen to likes. For streams with many viewers, this event is not always triggered by TikTok.
    tiktokLiveConnection.on('like', data => {
        console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
        io.emit('like', data);
    })
    

    // can also listen to follows and other events
}


server.listen(BACK_PORT, () => {
    console.log(`Socket.IO server is running on port ${BACK_PORT}`);
});
