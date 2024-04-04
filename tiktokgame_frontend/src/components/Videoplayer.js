
import ReactPlayer from 'react-player'
import gameStartingSoon from '../assets/Game_starting_soon.mp4'
import gameStartingSoon2 from '../assets/Game_starting_soon_2.mp4'
import hadAGreatDay from '../assets/Hope_everyone_had_a_great.mp4'
import { useEffect, useState } from 'react'
import pic from '../assets/2dbomb.png'

// https://elevenlabs.io/
// https://www.d-id.com/
// https://responsivevoice.org/api/

function Videoplayer({ gameHasStarted }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [videoUrl, setVideoUrl] = useState(gameStartingSoon)
    useEffect(() => {
        const oneOrTwo = Math.floor(Math.random() * 2) + 1;
        if (gameHasStarted) {
            setVideoUrl(hadAGreatDay)
            setTimeout(() => { // After game has started greet after x seconds
                setIsPlaying(true);
            }, 3000);
        } else {
            if (oneOrTwo === 1) {
                setVideoUrl(gameStartingSoon)
            } else {
                setVideoUrl(gameStartingSoon2)
            }
            setTimeout(() => { // After game has finished greet after x seconds
                setIsPlaying(true);
            }, 3000);
        }
    }, [gameHasStarted])

    useEffect(() => {

    }, [])
    return (
        <div>
            <ReactPlayer url={videoUrl} playing={isPlaying} onEnded={() => {
                setVideoUrl(hadAGreatDay)
                setIsPlaying(false)
            }} width={200} height={200} />
        </div>
    );
}

export default Videoplayer;