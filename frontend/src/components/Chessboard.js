import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turn, setTurn] = useState(game.turn());
  const [status, setStatus] = useState('');

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
      updateStatus(gameCopy);
    }

    return result;
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to queen for simplicity
    });

    if (!move) return false; // Invalid move
    return true;
  };

  const updateStatus = (gameCopy) => {
    if (gameCopy.isCheckmate()) {
      setStatus(`Checkmate! ${turn === 'w' ? 'Black' : 'White'} wins.`);
    } else if (gameCopy.isDraw()) {
      setStatus('Draw!');
    } else if (gameCopy.isCheck()) {
      setStatus(`Check! ${turn === 'w' ? 'White' : 'Black'} to move.`);
    } else {
      setStatus('');
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setTurn(newGame.turn());
    setStatus('');
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold">Chess Game</h2>
      <div className="mt-4">
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      <p className="mt-2 text-lg">Turn: {turn === 'w' ? 'White' : 'Black'}</p>
      <p className="text-lg font-semibold">{status}</p>
      <button
        onClick={resetGame}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
      >
        Reset Game
      </button>
    </div>
  );    
}

export default ChessGame;
