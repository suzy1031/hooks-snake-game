import React from 'react';
import { GameStatus } from '../constants';

const Button = ({ status, onStart, onStop, onRestart }) => {
  return (
    <div className='button'>
      {status === GameStatus.gameOver && (
        <button className='btn btn-gameOver' onClick={onRestart}>
          gameOver
        </button>
      )}
      {status === GameStatus.init && (
        <button className='btn btn-init' onClick={onStart}>
          start
        </button>
      )}
      {status === GameStatus.suspended && (
        <button className='btn btn-suspended' onClick={onStart}>
          start
        </button>
      )}
      {status === GameStatus.playing && (
        <button className='btn btn-playing' onClick={onStop}>
          stop
        </button>
      )}
    </div>
  );
};

export default Button;
