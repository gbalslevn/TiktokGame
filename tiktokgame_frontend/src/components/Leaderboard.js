import React, { useState } from 'react';
import './leaderboard.css';
const Leaderboard = ({ winners }) => {
    const [testWinners, setWinners] = useState([
        { id: 1, label: 'Player 1', points: 100 },
        { id: 2, label: 'Player 2', points: 80 },
        { id: 3, label: 'Player 3', points: 120 },
        { id: 4, label: 'Player 4', points: 90 },
        { id: 5, label: 'Player 1', points: 100 },
        { id: 6, label: 'Player 2', points: 80 },
        { id: 7, label: 'Player 3', points: 120 },
        { id: 8, label: 'Player 4', points: 90 },
        { id: 9, label: 'Player 4', points: 90 },
        { id: 10, label: 'Player 4', points: 90 },
    ]);

    // fills with empty players if there is less than 10 unique players
    for (let i = 0; i < 10; i++) {
        if (winners.length < 10) {
            winners.push({ id: `placeholder${i}`, label: '', points: 0 });
        }
    }

    const sortedLeaderboard = winners.sort((a, b) => b.points - a.points);
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
                            <td>{player.label}</td>
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
