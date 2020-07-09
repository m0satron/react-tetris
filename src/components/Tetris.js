import React, { useState } from 'react';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { createStage, checkCollision } from '../gameHelpers'

import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';

import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';
import { useInterval } from '../hooks/useInterval';

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage] = useStage(player, resetPlayer);

  console.log('re-render');

  const movePlayer = dir => {
    if(checkCollision(player, stage, { x: dir, y: 0 })) return;
      updatePlayerPos({x: dir, y: 0})
  }

  const startGame = () => {
    //reset everything
    setStage(createStage());
    setDropTime(1000)
    resetPlayer();
    setGameOver(false)
  }

  const drop = () => {
    if(checkCollision(player, stage, {x: 0, y: 1})) {
      if(player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      
      }
      return updatePlayerPos({x: 0, y: 0, collided: true})
    
    }
    updatePlayerPos({x: 0, y: 1, collided: false})
  }

  const keyUp = ({ keyCode}) => {
    console.log("interval on")
    if(gameOver) return;
    if(keyCode === 40) {
      setDropTime(1000);
    }
  }

  const dropPlayer = () => {
    console.log("interval off")
    setDropTime(null);
    drop();
  }

  const move = ({ keyCode }) => {
    if(!gameOver) {
      if(keyCode === 37) movePlayer(-1);
      if(keyCode === 39) movePlayer(1);
      if(keyCode === 40) dropPlayer();
      if(keyCode === 38) playerRotate(stage, 1) 
    }
  }

  useInterval(() =>   {
    drop();
  }, dropTime)

  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display
              gameOver={gameOver}
              text="Game Over"
            />
          ) : (
              <div>
                <Display text="Score" />
                <Display text="Rows" />
                <Display text="Level" />
              </div>
            )}
          <StartButton callback={startGame}/>
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  )
}

export default Tetris;