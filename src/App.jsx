import {useState, useEffect, useRef} from 'react'
import useSound from 'use-sound'
import simon from './assets/sounds/sprite.mp3'
import './App.css'

function App() {
  const blueRef = useRef(null);
  const yellowRef = useRef(null);
  const greenRef = useRef(null);
  const redRef = useRef(null);

  const [play] = useSound(simon, {
    sprite: {
      one: [0, 500],
      two: [1000, 500],
      three: [2000, 500],
      four: [3000, 500],
      error: [4000, 1000]
    },
  });

  const colors = [
    {
      color: '#FAF303',
      ref: yellowRef,
      sound: 'one'
    },
    {
      color: '#030AFA',
      ref: blueRef,
      sound: 'two'
    },
    {
      color: '#FA0E03',
      ref: redRef,
      sound: 'three'
    },
    {
      color: '#0AFA03',
      ref: greenRef,
      sound: 'four'
    }
  ];

  const [highScore, setHighScore] = useState(0);

  const [bestGame, setBestGame] = useState([]);
  const [lastGame, setLastGame] = useState([]);

  const minNumber = 0;
  const maxNumber = 3;
  const speedGame = 400;

  const [sequence, setSequence] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [isAllowedToPlay, setIsAllowedToPlay] = useState(false);
  const [speed, setSpeed] = useState(speedGame);
  const [turn, setTurn] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [success, setSuccess] = useState(0);
  const [isGameOn, setIsGameOn] = useState(false);
  const [isDemoOn, setIsDemoOn] = useState(false);
  const [isLastGameOn, setLastGameOn] = useState(false);

  const initGame = () => {
    setTimeout(() => {
      randomNumber();
    }, 500)
    
    setIsGameOn(true);
  }

  const initHighScoreGame = () => {
    if(bestGame.length !== 0)
    {
      setIsDemoOn(true);
      setIsAllowedToPlay(false);
    }
    
  }

  const initLastGame = () => {
    if(lastGame.length !== 0)
    {
      setLastGameOn(true);
      setIsAllowedToPlay(false);
    }
    
  }

  useEffect(() => {
    if(isLastGameOn)
    {
      lastGame.map((item, index) => {
        setTimeout(() => {
          if(index === lastGame.length - 1)
          {
            setLastGameOn(false);
          }
          else
          {
            play({id: colors[item].sound})
            colors[item].ref.current.style.opacity = (1);
            setTimeout(() => {
              colors[item].ref.current.style.opacity = (0.5);
            }, speed / 2)
          }
        }, speed * index)
      })
    }
  }, [isLastGameOn])

  useEffect(() => {
    if(isDemoOn)
    {
      bestGame.map((item, index) => {
        setTimeout(() => {
          if(index === bestGame.length - 1)
          {
            setIsDemoOn(false);
          }
          else
          {
            play({id: colors[item].sound})
            colors[item].ref.current.style.opacity = (1);
            setTimeout(() => {
              colors[item].ref.current.style.opacity = (0.5);
            }, speed / 2)
          }
        }, speed * index)
      })
    }
  }, [isDemoOn])

  useEffect(() => {
    if(!isAllowedToPlay){
      sequence.map((item, index) => {
        setTimeout(() => {
          play({id: colors[item].sound})
          colors[item].ref.current.style.opacity = (1);
          setTimeout(() => {
            colors[item].ref.current.style.opacity = (0.5);
            if(index===sequence.length - 1)
            {
              setIsAllowedToPlay(true);
            }
          }, speed / 2)
        }, speed * index)
      })
    }
  }, [sequence])

  useEffect(() => {
    if(pulses > 0){
      if(Number(sequence[pulses - 1]) === Number(currentGame[pulses - 1])){
        setSuccess(success + 1);
      } else {
        const index = sequence[pulses - 1];
        if (index) colors[index].ref.current.style.opacity = (1);
        play({id: 'error'})
        setTimeout(() => {
          if (index) colors[index].ref.current.style.opacity = (0.5);
          setIsGameOn(false);
        }, speed * 2)
        setIsAllowedToPlay(false);
      }
    }
  }, [pulses])

  useEffect(() => {
    if(!isGameOn) {
      if((turn-1) > highScore)
      {
        setHighScore(turn-1);
        setBestGame(sequence);
      }
      setLastGame(sequence);
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isGameOn])

  useEffect(() => {
    if(!isDemoOn)
    {
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isDemoOn])

  useEffect(() => {
    if(!isLastGameOn)
    {
      setSequence([]);
      setCurrentGame([]);
      setIsAllowedToPlay(false);
      setSpeed(speedGame);
      setSuccess(0);
      setPulses(0);
      setTurn(0);
    }
  }, [isLastGameOn])

  useEffect(() => {
    if(success === sequence.length && success > 0) {
      setSpeed(speed - sequence.length);
      setTimeout(() => {
        setSuccess(0);
        setPulses(0);
        setCurrentGame([])
        randomNumber();
      }, 500);
    }
  }, [success])

  const randomNumber = () => {
    setIsAllowedToPlay(false);
    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber);
    setSequence([...sequence, randomNumber]);
    setTurn(turn + 1);
  }

  const handleClick = (index) => {
    if(isAllowedToPlay) {
      play({id: colors[index].sound})
      colors[index].ref.current.style.opacity = (1);
      colors[index].ref.current.style.scale = (0.9);
      setTimeout(() => {
        colors[index].ref.current.style.opacity = (0.5);
        colors[index].ref.current.style.scale = (1);
        setCurrentGame([...currentGame, index]);
        setPulses(pulses + 1);
      }, speed / 2)
    }
  }

  let header = "";

  if(isGameOn)
  {
    header = <h1>Turn {turn}</h1>;
  }
  else if(isDemoOn)
  {
    header = <h1>Best Game</h1>
  }
  else
  {
    header = <h1>Last Game</h1>
  }

  return(
    <>
    {
      isGameOn || isDemoOn || isLastGameOn
      ?
      <>
      <div id="gameHeader">
        {header}
      </div>
      <div className='container'>

        {colors.map((item, index) => {
          return (
            <div
            key={index}
            ref={item.ref}
            className={`pad pad-${index}`}
            style={{opacity: 0.6}}
            onClick={() => handleClick(index)}
            >
            </div>
          )
        })}
      </div>
      </>
      :
      <>
      <div id="gameHeader">
        <h1>KAOTIK SIMON</h1>
        <h2>HIGH SCORE: {highScore}</h2>
        <button id="button" onClick={initGame}>START</button>
        <button id="button2" onClick = {initHighScoreGame}>BEST GAME</button>
        <button id="button3" onClick = {initLastGame}>LAST GAME</button>
      </div>
      </>
    }
    </>
  )
}

export default App
