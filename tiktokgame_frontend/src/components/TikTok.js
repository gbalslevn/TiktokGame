import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function TikTok({ handleComments, handleGifts, handleLikes }) {
    const [inputValue, setInputValue] = useState('');
    const BACKEND_PORT = 3001
    function connectTiktok(username) {
        fetch(`http://localhost:${BACKEND_PORT}/api/connectTiktok?username=${username}`)
            .then(response => {
                if (response.ok) {
                    console.log('Connected to tik tok live from user: ' + username);
                } else {
                    console.error('Failed connect to tik tok live. Check node server for err message');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Function to handle button click
    const handleButtonClick = () => {
        connectTiktok(inputValue);
    };

    // Function to handle input change
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    function handleComment(comment) {
        if (handleComments) {
            //console.log("user wants the comments")
            handleComments(comment)
        } else {
            console.log("No comment handler provided")
        }
    }
    function handleGift(gift) {
        if (handleGifts) {
            //console.log("user wants the gifts")
            handleGifts(gift)
        } else {
            console.log("No gift handler provided")
        }
    }
    function handleLike(like) {
        if (handleLikes) {
            //console.log("user wants the likes")
            handleLikes(like)
        } else {
            console.log("No gift handler provided")
        }
    }

    // Establish socket to live
    useEffect(() => {
        const socket = io(`http://localhost:${BACKEND_PORT}`);

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socket.on('chatMessage', message => {
            //console.log('Received chat message:', message);
            handleComment(message)
        });

        socket.on('gift', gift => {
            //console.log('Received gift:', gift);
            handleGift(gift)
        });
        socket.on('like', like => {
            //console.log('Received like:', like);
            handleLike(like)
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter Tiktok username"
            />
            <button onClick={handleButtonClick}>Connect to live</button>
        </div>
    );
}

export default TikTok;