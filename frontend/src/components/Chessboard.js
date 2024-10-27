import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const getPieceIcon = (move) => {
  const pieceType = move.charAt(0).toLowerCase(); // Get the first character for the piece type
  const color = move.charAt(1) === 'w' ? 'white' : 'black'; // Determine color
  const iconMap = {
    'p': 'fa-chess-pawn',
    'r': 'fa-chess-rook',
    'n': 'fa-chess-knight',
    'b': 'fa-chess-bishop',
    'q': 'fa-chess-queen',
    'k': 'fa-chess-king'
  };
  return iconMap[pieceType] ? <i className={`fas ${iconMap[pieceType]} text-${color}`}></i> : null;
};

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
      setGame(gameCopy);
      setFen(gameCopy.fen());
      setTurn(gameCopy.turn());
      setMoveHistory(moveHistory.slice(0, -1)); // Remove last move
      setPrevFenHistory(prevFenHistory.slice(0, -1)); // Remove last FEN
      updateStatus(gameCopy);
    }
  };

  // Separate move history for white and black
  const whiteMoves = moveHistory.filter((_, index) => index % 2 === 0);
  const blackMoves = moveHistory.filter((_, index) => index % 2 !== 0);

  return (
    <div className="flex p-4 bg-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Chess Game</h2>
        <div className="mt-4" style={{ width: '500px', height: '500px' }}>
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
      </div>
      <div className="ml-8 flex flex-col w-[400px] bg-white rounded-lg shadow-lg p-4">
        <h3 className="font-bold text-lg text-center mb-2">Move History</h3>
        <div className="flex flex-col h-80 overflow-y-auto">
          <div className="flex">
            <div className="flex flex-col w-1/2 pr-2">
              <h4 className="font-semibold text-center text-indigo-600 mb-1">White Moves</h4>
              <ul className="list-disc pl-5">
                {whiteMoves.map((move, index) => (
                  <li key={index} className="py-1 hover:bg-gray-200 transition flex items-center">
                    {getPieceIcon(move)}
                    <span className="ml-2">{move}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col w-1/2 pl-2">
              <h4 className="font-semibold text-center text-indigo-600 mb-1">Black Moves</h4>
              <ul className="list-disc pl-5">
                {blackMoves.map((move, index) => (
                  <li key={index} className="py-1 hover:bg-gray-200 transition flex items-center">
                    {getPieceIcon(move)}
                    <span className="ml-2">{move}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col p-4 border-t mt-2">
          <h3 className="font-bold text-lg text-center">Chat Section</h3>
          <p className="text-center text-gray-500">Chat functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default ChessGame;
