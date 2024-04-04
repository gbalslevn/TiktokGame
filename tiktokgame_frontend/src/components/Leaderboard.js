import React, { useState } from 'react';
import './leaderboard.css';
const Leaderboard = (props) => {
    const [testWinners, setWinners] = useState([
        { id: 1, name: 'Player 1', points: 100 },
        { id: 2, name: 'Player 2', points: 80 },
        { id: 3, name: 'Player 3', points: 120 },
        { id: 4, name: 'Player 4', points: 90 },
        { id: 5, name: 'Player 1', points: 100 },
        { id: 6, name: 'Player 2', points: 80 },
        { id: 7, name: 'Player 3', points: 120 },
        { id: 8, name: 'Player 4', points: 90 },
        { id: 9, name: 'Player 4', points: 90 },
        { id: 10, name: 'Player 4', points: 90 },
    ]);

    const sortedLeaderboard = testWinners.sort((a, b) => b.points - a.points);
    const top10Winners = sortedLeaderboard.slice(0, 10);

    return (
        <div>
            <table className="leaderboard-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {top10Winners.map((player, index) => (
                        <tr key={index} className={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : ''}>
                            <td>{player.name}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/*
            {props.allPlayers.map((str, index) => (
                <p key={index}>{str}</p>
            ))}
            */ }
        </div>
    );
};

export default Leaderboard;
