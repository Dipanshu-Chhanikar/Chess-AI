import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [turn, setTurn] = useState(game.turn());
  const [moveHistory, setMoveHistory] = useState([]);
  const [prevFenHistory, setPrevFenHistory] = useState([]);
  const [status, setStatus] = useState('');

  const makeMove = (move) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result) {
      setPrevFenHistory((prev) => [...prev, game.fen()]); // Save previous FEN
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
      setMoveHistory((prev) => [...prev, result.san]); // Save the SAN of the move
      updateStatus(gameCopy);
    }

    return result;
  };

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to queen for simplicity
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
    setMoveHistory([]);
    setPrevFenHistory([]);
    setStatus('');
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;

    const lastFen = prevFenHistory[prevFenHistory.length - 1];
    
    if (lastFen) {
      const gameCopy = new Chess(lastFen);
      
      // Update the state with the new game state
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
      
      // Remove the last move from the move history and FEN history
      setMoveHistory(moveHistory.slice(0, -1)); // Remove last move
      setPrevFenHistory(prevFenHistory.slice(0, -1)); // Remove last FEN

      // Update the status
      updateStatus(gameCopy);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chess Game</h2>
      <div className="mt-4" style={{ width: '400px', height: '400px' }}>
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      <p className="mt-2 text-lg">Turn: {turn === 'w' ? 'White' : 'Black'}</p>
      <p className="text-lg font-semibold">{status}</p>
      <div className="flex mt-4 space-x-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700"
        >
          Reset Game
        </button>
        <button
          onClick={handleUndo}
          className="px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700"
        >
          Undo Move
        </button>
      </div>
      <h3 className="mt-4 font-bold">Move History:</h3>
      <ul>
        {moveHistory.map((move, index) => (
          <li key={index}>{move}</li> // Displaying Standard Algebraic Notation (SAN)
        ))}
      </ul>
    </div>
  );
}

export default ChessGame;
