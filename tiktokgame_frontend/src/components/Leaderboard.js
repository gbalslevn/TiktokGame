import React, { useState } from 'react';

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

    const sortedLeaderboard = props.winners.sort((a, b) => b.points - a.points);
    const top10Winners = sortedLeaderboard.slice(0, 10);

    return (
        <div>
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {top10Winners.map((player, index) => (
                        <tr key={player.label}>
                            <td>{index + 1}</td>
                            <td>{player.label}</td>
                            <td>{player.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {props.allPlayers.map((str, index) => (
                <p key={index}>{str}</p>
            ))}
        </div>
    );
};

export default Leaderboard;
