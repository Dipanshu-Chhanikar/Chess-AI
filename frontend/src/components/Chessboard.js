import React, { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turn, setTurn] = useState(game.turn());

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
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

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold">Chess Game</h2>
      <div className="mt-4">
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      <p className="mt-2 text-lg">Turn: {turn === 'w' ? 'White' : 'Black'}</p>
    </div>
  );
}

export default ChessGame;
