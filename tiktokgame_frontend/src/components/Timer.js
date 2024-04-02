import { CountdownCircleTimer } from "react-countdown-circle-timer";

import './timer.css';
import { useState } from "react";

function Timer({ gameHasStarted, setGameHasStarted, duration }) {
    const [key, setKey] = useState(0) 
    const renderTime = ({ remainingTime }) => {
        if (remainingTime === 0) {
            //return <div className="timer">Good luck</div>;
        }

        return (
            <div className="timer">
                <div className="text">Starting in</div>
                <div className="value">{remainingTime}</div>
                <div className="text">seconds</div>
            </div>
        );
    };

    return (
        <div className="timer-wrapper">
            <CountdownCircleTimer
                key={key}
                isPlaying={!gameHasStarted}
                duration={duration}
                onComplete={() => {
                    setKey(prevKey => prevKey + 1)
                    setGameHasStarted(true)
                    return { shouldRepeat: true }
                }}
                colors={['#47af3e', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                size={100}
            >
                {renderTime}
            </CountdownCircleTimer>
        </div>
    );
}

export default Timer;

