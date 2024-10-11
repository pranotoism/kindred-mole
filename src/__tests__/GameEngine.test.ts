import { GameEngine } from '../engine/GameEngine';

describe('GameEngine', () => {
  let gameEngine: GameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  test('should start with a score of 0', () => {
    expect(gameEngine.getScore()).toBe(0);
  });

  test('should increment score when points are added', () => {
    gameEngine.incrementScore(5);
    expect(gameEngine.getScore()).toBe(5);
  });

  test('should not increment score if the game is over', () => {
    gameEngine.endGame();
    gameEngine.incrementScore(5);
    expect(gameEngine.getScore()).toBe(0);
  });

  test('should track the number of clicks', () => {
    gameEngine.incrementNumOfClicks();
    gameEngine.incrementNumOfClicks();
    expect(gameEngine.getNumOfClicks()).toBe(2);
  });

  test('should not increment number of clicks if the game is over', () => {
    gameEngine.endGame();
    gameEngine.incrementNumOfClicks();
    expect(gameEngine.getNumOfClicks()).toBe(0);
  });

  test('should set the game over state to true', () => {
    gameEngine.endGame();
    expect(gameEngine.isGameOver()).toBe(true);
  });

  test('should return a random mole hide time within the expected range', () => {
    const hideTime = gameEngine.getRandomMoleHideTime();
    expect(hideTime).toBeGreaterThanOrEqual(200);
    expect(hideTime).toBeLessThanOrEqual(400);
  });

  test('should reset the game correctly', () => {
    gameEngine.incrementScore(5);
    gameEngine.incrementNumOfClicks();
    gameEngine.endGame();

    gameEngine.resetGame();

    expect(gameEngine.getScore()).toBe(0);
    expect(gameEngine.getNumOfClicks()).toBe(0);
    expect(gameEngine.isGameOver()).toBe(false);
  });
});
