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
  const [numOfClicks, setNumOfClicks] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [timer, setTimer] = useState(0);

  const gameEngineRef = useRef<GameEngine>(new GameEngine());
  const moleHideTimer = useRef<number | null>(null);

  const updateScore = useCallback((points: number) => {
    gameEngineRef.current.incrementScore(points);
    setScore(gameEngineRef.current.getScore());
  }, []);

  const debouncedClick = useDebounce(numOfClicks, 1000);

  const randomizeMole = () => {
    if (gameEngineRef.current.isGameOver()) return;

    const randomPosition = Math.floor(Math.random() * 9);
    setMolePosition(randomPosition);

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

  const stopGame = useCallback(() => {
    setIsGameRunning(false);
    clearTimeout(moleHideTimer.current!);
    gameEngineRef.current.endGame();
  }, []);

  useEffect(() => {
    if (isGameRunning) {
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isGameRunning, stopGame]);

  const updateNumOfClicks = () => {
    if (isGameRunning) {
      setMolePosition(null);
      gameEngineRef.current.incrementNumOfClicks();
      setNumOfClicks(gameEngineRef.current.getNumOfClicks());

      clearTimeout(moleHideTimer.current!);
    } else {
      if (score >= 10) alert('Dude, you won already! Restart the game!');
    }
  };

  useEffect(() => {
    if (score < 10) {
      if (debouncedClick > 0) {
        randomizeMole();
      }
    } else {
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
