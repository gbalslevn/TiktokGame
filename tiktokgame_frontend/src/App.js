import './App.css';
import Matter from 'matter-js';
import bombImage from './assets/2dbomb.png'
//import testProfilePic from './assets/profilepicture.jpg'
import explosion from './assets/explosion.wav';
import ding from './assets/ding.mp3'
import footstep from './assets/footstep.wav'
import popup from './assets/popup.wav'
import { useEffect, useState, useCallback } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import Leaderboard from './components/Leaderboard';
import Timer from './components/Timer';
import TikTok from './components/TikTok';
import Videoplayer from './components/Videoplayer';
// spil minecraft soundtrack
// elevenlabs til lyd. D-Id til video. Måske bruge heygen. 
// Når folk joiner brug https://responsivevoice.org/

function App() {
  //const video = require('./assets/Game_starting_soon.mp4')
  const [showWinner, setShowWinner] = useState(false)
  const [latestWinner, setLatestWinner] = useState('G')
  const [winners, setWinners] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [gameHasLoaded, setGameHasLoaded] = useState(false)
  const [gameHasStarted, setGameHaStarted] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [world, setWorld] = useState()
  const [latestComment, setLatestComment] = useState(null)
  const [latestLike, setLatestLike] = useState(null)
  const [latestGift, setLatestGift] = useState(null)

  const canvasWidth = 800
  const canvasHeight = 400

  function createGame() {
    const engine = Matter.Engine.create()
    engine.gravity.y = 0
    const world = engine.world
    setWorld(world)
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        showAngleIndicator: true,
        showCollisions: true,
        hasBounds: true,
        wireframes: false,
        background: '#fff'
      }
    });

    Matter.Render.run(render);

    // create runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const wallThichness = 1
    Matter.Composite.add(world, [
      // walls - Created with (xpos, ypos, width, height)
      Matter.Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, wallThichness, { isStatic: true }), // Top
      Matter.Bodies.rectangle(canvasWidth / 2, canvasHeight, canvasWidth, wallThichness, { isStatic: true }), // Bottom
      Matter.Bodies.rectangle(0, canvasHeight / 2, wallThichness, canvasHeight, { isStatic: true }), // Left
      Matter.Bodies.rectangle(0, canvasHeight / 2, 50, canvasHeight, { isStatic: true, render: { fillStyle: "grey" }, collisionFilter: { category: 0x0002 } }), // Start object. Up to 32 different collision categories. 0x0001 is default
      Matter.Bodies.rectangle(canvasWidth, canvasHeight / 2, 50, canvasHeight, { isStatic: true, render: { fillStyle: "green" } }) // Right - Finish line. 
    ]);
    // checking collision with green finish line
    Matter.Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs;
      var pair = pairs[0];
      if (pair.bodyA.render.fillStyle === 'green') {
        winHandler(pair.bodyB.label)
        resetWorld(world, engine, render, runner)
      }
    });

    //const startPlayer = createPlayer("Startplayer")
    //Matter.Composite.add(world, [startPlayer])
    setGameHasLoaded(true)
  }

  function createPlayer(username, profilePic) {
    const player = Matter.Bodies.rectangle(12, canvasHeight / 2, 20, 20,
      {
        frictionAir: 0.03,
        density: 0.3,
        friction: 0.8,
        label: username,
        collisionFilter: { mask: 0x0001, }, // Should be able to hit each other
        render: { sprite: { texture: profilePic, xScale: 0.25, yScale: 0.25 } } // uncomment this for profile pic
      }
    )
    return player
  }

  function spawnPlayer(username, profilePic) {
    const player = createPlayer(username, profilePic)
    playSound(popup, 0.25)
    Matter.Composite.add(world, [player])
    setAllPlayers([...allPlayers, username]);
  }

  function move(username, likes = 1) {
    const allBodies = Matter.Composite.allBodies(world)
    const foundPlayer = allBodies.find(player => player.label === username);
    const force = 0.5 * Math.log10(likes + 9) // +10 so if 1 like is sent it it not log10(1) = 0
    if (foundPlayer) {
      console.log("Object found with name:", username);
      Matter.Body.applyForce(foundPlayer, foundPlayer.position, { x: force, y: 0 })
      playSound(footstep)
    } else {
      //console.log("Object not found with name:", username);
    }
  }


  function testMove() {
    const allBodies = Matter.Composite.allBodies(world)
    const randomIndex = Math.floor(Math.random() * (allBodies.length - 4)) + 4;
    const randomPlayer = allBodies[randomIndex]
    playSound(footstep)
    Matter.Body.applyForce(randomPlayer, randomPlayer.position, { x: 2, y: 0 })
  }


  async function spawnBomb() {
    const randomX = Math.floor(Math.random() * (canvasWidth - 100 + 1)) + 100;
    const randomY = Math.floor(Math.random() * (canvasHeight - 0 + 1)) + 0;
    const bomb = Matter.Bodies.rectangle(randomX, randomY, 10, 10, { isStatic: true, render: { sprite: { texture: bombImage, xScale: 0.1, yScale: 0.1 } } })
    Matter.Composite.add(world, [bomb])
    playSound(ding)
    await new Promise(resolve => setTimeout(resolve, 1500));
    playSound(explosion, 0.25)
    Matter.Composite.remove(world, [bomb])
    explode(bomb.position)
  }

  // Creates consequense of blast radius
  function explode(bombPosition) {
    const allBodies = Matter.Composite.allBodies(world)
    allBodies.forEach(player => {
      if (player.label === 'Rectangle Body') { // should only affect players
        return
      }
      const xDistanceToBomb = bombPosition.x - player.position.x
      const yDistanceToBomb = bombPosition.y - player.position.y
      //const bigDistance = 120
      //const medDistance = 80
      //const lowDistance = 20
      // I am calculating blast radius in squares. Maybe it should be using circles. Utilizing pi.
      // later: check if they are safe from blast. If they have bought safety. Could also add effect on y-axis

      // Checks to determine to blast
      if (Math.abs(xDistanceToBomb) < 20 && Math.abs(yDistanceToBomb) < 20) { // player dies. 
        Matter.Composite.remove(world, [player])
      }
      if (xDistanceToBomb < 0 && xDistanceToBomb > -120) { // The player has passed the bomb
        if (yDistanceToBomb < 0 && yDistanceToBomb > -120) { // The player is above the bomb
          Matter.Body.applyForce(player, player.position, { x: 1, y: 1 })
        } else { // The player is below the bomb
          Matter.Body.applyForce(player, player.position, { x: 1, y: -1 })
        }
      } else if (xDistanceToBomb > 0 && xDistanceToBomb <= 80) { // Player is to the left of the bomb. gets a blast
        if (yDistanceToBomb < 0 && yDistanceToBomb > -120) {  // The same check as when player bassed the bomb. Could maybe be refactored so there is less code dublication
          Matter.Body.applyForce(player, player.position, { x: -2, y: 2 })
        } else {
          Matter.Body.applyForce(player, player.position, { x: -2, y: -2 })
        }
      } else if (xDistanceToBomb > 80 && xDistanceToBomb <= 120) { // gets minor blast
        if (yDistanceToBomb < 0 && yDistanceToBomb > -120) {
          Matter.Body.applyForce(player, player.position, { x: -1, y: 1 })
        } else {
          Matter.Body.applyForce(player, player.position, { x: -1, y: -1 })
        }
      }
    });
  }

  function winHandler(winnerUsername) {
    setLatestWinner(winnerUsername)
    setShowWinner(true)
    setConfetti(true)
    setGameHaStarted(false)
    // Increment points or add the person as a winner
    const newArray = winners
    const playerIndex = winners.findIndex(winner => winner.label === winnerUsername);
    if (playerIndex !== -1) {
      newArray[playerIndex].points++
    } else {
      newArray.push({ label: winnerUsername, points: 1 })
    }
    setWinners(newArray)
    announceWinner(winnerUsername)
  }

  function resetWorld(world, engine, render, runner) {
    setGameHasLoaded(false)
    setAllPlayers([])
    Matter.World.clear(world);
    Matter.Engine.clear(engine);
    Matter.Render.stop(render);
    Matter.Runner.stop(runner);
    Matter.Events.off(engine, 'collisionStart')
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    createGame()
  }

  function handleComments(comment) {
    if (gameHasLoaded) {
      const username = comment.uniqueId
      const allBodies = Matter.Composite.allBodies(world)
      const playerExists = allBodies.find(player => player.label === username);
      if (!playerExists) {
        setLatestComment(comment) // når latestComment ændrer sig skal man kalde spawnplayer i useEffect
        // Prøvede også at have spawnplayer i den her metode (handleComments), men når man gav handlecomments til Tik Tok komponenten var det som om den gemte en gammel state af world, så den kunne ikke spawne players i nye verdener. Løst med useEffect løsningen
      } else {
        //console.log(`Player ${username} has already joined`);
      }
    }
  };

  function handleGifts(gift) {
    if (gameHasLoaded) {
      //setLatestGift(gift)
    }
  }
  function handleLikes(like) {
    if (gameHasLoaded) {
      setLatestLike(like)
    }
  }

  useEffect(() => {
    if (latestComment) {
      const username = latestComment.uniqueId
      const profilePic = latestComment.profilePictureUrl
      console.log(latestComment)
      spawnPlayer(username, profilePic)
    }
  }, [latestComment])

  useEffect(() => {
    if (latestGift) {
      const giftType = latestGift.giftName
      if (giftType === "Rose") {
        spawnBomb()
      }
      console.log(latestGift)
    }
  }, [latestGift])

  useEffect(() => {
    if (latestLike) {
      if(gameHasStarted) {
        const username = latestLike.uniqueId
        const likeCount = latestLike.likeCount // Amount likes sent for each like
        move(username, likeCount)
      }
      //console.log(latestLike)
    }
  }, [latestLike])


  const announceWinner = (winnerUsername) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices()
    const utterance = new SpeechSynthesisUtterance(`Congratulations! The winner is ${winnerUsername}.`);
    utterance.pitch = 1.8;
    utterance.rate = 0.9;
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === "Grandma (Engelsk (Storbritannien))") {
        utterance.voice = voices[i];
      }
    }
    utterance.lang = "en-GB";
    synth.speak(utterance);
  };

  function playSound(file, volume = 1) {
    const audio = new Audio(file)
    audio.volume = volume
    audio.play()
  }

  useEffect(() => {
    createGame()
  }, [])

  return (
    <div className="App">
      <button onClick={() => { spawnPlayer("Gustav") }}>Ny spiller</button>
      <button onClick={() => { move("Gustav") }}>Boost</button>
      <button onClick={spawnBomb}>Bomb</button>
      <button onClick={createGame}>Lav spil</button>
      {/*<button onClick={() => { setConfetti(true) }}><>{confetti && <ConfettiExplosion />}</>Confetti</button>*/}
      <Leaderboard winners={winners} allPlayers={allPlayers}></Leaderboard>
      {/*<video src={video} type="video/mp4" autoPlay width={300} height={300}></video>*/}
      <div className='latestWinner'><p>Latest winner is: {latestWinner}</p></div>{confetti && <ConfettiExplosion />}{/*showWinner && <ComponentToShow />*/}
      <div className='timer'><Timer duration={10} gameHasStarted={gameHasStarted} setGameHasStarted={setGameHaStarted}></Timer></div>
      {gameHasLoaded && <TikTok handleComments={handleComments} handleGifts={handleGifts} handleLikes={handleLikes} />}
      <Videoplayer gameHasStarted={gameHasStarted}></Videoplayer>
    </div>
  );
}

export default App;
