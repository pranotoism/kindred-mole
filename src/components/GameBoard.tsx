import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { GameEngine } from '../engine/GameEngine';
import Mole from './Mole';
import { useDebounce } from '@src/helpers/debounce';

const GameBoard: React.FC = () => {
  const [molePosition, setMolePosition] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [numOfClicks, setNumOfClicks] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);

  const moleHideTimer = useRef<number | null>(null);
  const gameEngineRef = useRef<GameEngine>(new GameEngine());

  const updateScore = useCallback((points: number) => {
    gameEngineRef.current.incrementScore(points);
    setScore(gameEngineRef.current.getScore());
  }, []);

  const debouncedClick = useDebounce(numOfClicks, 1000);

  //   randomize mole position
  const randomizeMole = () => {
    if (gameEngineRef.current.isGameOver()) return;

    // show the mole
    const randomPosition = Math.floor(Math.random() * 9);
    setMolePosition(randomPosition);

    // hide the mole
    moleHideTimer.current = window.setTimeout(() => {
      setMolePosition(null);
      randomizeMole();
    }, gameEngineRef.current.getRandomMoleHideTime());
  };

  const startGame = useCallback(() => {
    gameEngineRef.current.resetGame();
    setIsGameRunning(true);
    setScore(0);
    setNumOfClicks(0);
    setTimer(0);
    randomizeMole();
  }, []);

  //   to end the game entirely
  const stopGame = useCallback(() => {
    setIsGameRunning(false);
    clearTimeout(moleHideTimer.current!);
    gameEngineRef.current.endGame();
  }, []);

  useEffect(() => {
    if (isGameRunning) {
      // run the timer
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isGameRunning, stopGame]);

  const updateNumOfClicks = () => {
    if (isGameRunning) {
      setMolePosition(null);
      gameEngineRef.current.incrementNumOfClicks();
      setNumOfClicks(gameEngineRef.current.getNumOfClicks());

      //   stop mole from appearing
      clearTimeout(moleHideTimer.current!);
    } else {
      if (score >= 10) alert('Dude, you won already! Restart the game!');
    }
  };

  useEffect(() => {
    if (score < 10) {
      if (debouncedClick > 0) {
        // start randomizing mole location again after user click
        randomizeMole();
      }
    } else {
      // if score >= 10 then stop the game and show alert
      stopGame();
      alert(
        `Gotcha! You score at least 10 points in ${timer} seconds and ${numOfClicks} clicks!`
      );
    }
  }, [debouncedClick]);

  const handleMoleHit = useMemo(
    () => (isGolden: boolean) => {
      updateScore(isGolden ? 5 : 1);
      updateNumOfClicks();
    },
    [updateScore, updateNumOfClicks]
  );

  return (
    <div>
      <h1>Whack the Moles!</h1>
      <p>Score at least 10 to win</p>
      <p>Score: {score}</p>
      <p>Clicks: {numOfClicks}</p>
      <p>Elapsed time: {timer} seconds</p>
      <div className='game-grid'>
        {Array.from({ length: 9 }).map((_, idx) => (
          <Mole
            key={idx}
            isVisible={molePosition === idx}
            onHit={
              // molePosition === idx means the mole is visible in that hole.
              // so if the mole is visile run handleMoleHit, either way just increment the clicks number
              molePosition === idx ? handleMoleHit : () => updateNumOfClicks()
            }
          />
        ))}
      </div>
      <button
        className='btn-start'
        onClick={startGame}
        disabled={isGameRunning}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameBoard;
