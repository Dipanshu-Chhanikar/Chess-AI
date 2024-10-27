import React, { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const pieceIcons = {
    'p': 'pawn',
    'r': 'rook',
    'n': 'knight',
    'b': 'bishop',
    'q': 'queen',
    'k': 'king'
};

const getPieceIcon = (pieceType, color, size = 'text-lg') => {
    return <i className={`fas fa-chess-${pieceIcons[pieceType]} ${size} text-${color}`} />;
};

function ChessGame() {
    const [game, setGame] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());
    const [moveHistory, setMoveHistory] = useState([]);
    const [prevFenHistory, setPrevFenHistory] = useState([]);
    const [status, setStatus] = useState('');
    const [capturedWhite, setCapturedWhite] = useState([]);
    const [capturedBlack, setCapturedBlack] = useState([]);

    const makeMove = (move) => {
        const gameCopy = new Chess(game.fen());
        const targetPiece = gameCopy.get(move.to);
        const result = gameCopy.move(move);

        if (result) {
            setPrevFenHistory((prev) => [...prev, game.fen()]); // Save previous FEN
            
            // Capture the piece if there is one
            if (targetPiece) {
                if (targetPiece.color === 'w') {
                    setCapturedBlack((prev) => [...prev, targetPiece.type]); // Black captures white piece
                } else {
                    setCapturedWhite((prev) => [...prev, targetPiece.type]); // White captures black piece
                }
            }

            setGame(gameCopy);
            setFen(gameCopy.fen());
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
            setStatus(`Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`);
        } else if (gameCopy.isDraw()) {
            setStatus('Draw!');
        } else if (gameCopy.isCheck()) {
            setStatus(`Check! ${game.turn() === 'w' ? 'White' : 'Black'} to move.`);
        } else {
            setStatus('');
        }
    };

    const handleUndo = () => {
        if (moveHistory.length === 0) return;

        const lastFen = prevFenHistory[prevFenHistory.length - 1];
        
        if (lastFen) {
            const gameCopy = new Chess(lastFen);
            setGame(gameCopy);
            setFen(gameCopy.fen());
            setMoveHistory(moveHistory.slice(0, -1)); // Remove last move
            setPrevFenHistory(prevFenHistory.slice(0, -1)); // Remove last FEN
            updateStatus(gameCopy);
        }
    };

    // Separate move history for white and black
    const whiteMoves = moveHistory.filter((_, index) => index % 2 === 0);
    const blackMoves = moveHistory.filter((_, index) => index % 2 !== 0);

    return (
        <div className="flex p-4" style={{ backgroundColor: '#302E2B', minHeight: '100vh', width: '100%' }}>
            <div className="flex-1 flex flex-col items-center" style={{ backgroundColor: '#302E2B' }}>
                <h2 className="text-2xl font-bold mb-4 text-white">Chess Game</h2>
                <div className="mt-4" style={{ width: '550px', height: '550px' }}>
                    <div className="flex justify-between mb-2">
                        <div className="flex">
                            {capturedBlack.map((piece, index) => (
                                <div key={index} className="mr-1">
                                    {getPieceIcon(piece, 'black', 'text-xl')}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Chessboard position={fen} onPieceDrop={onDrop} />
                    <div className="flex justify-between mt-2">
                        <div className="flex">
                            {capturedWhite.map((piece, index) => (
                                <div key={index} className="mr-1">
                                    {getPieceIcon(piece, 'white', 'text-xl')}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="text-lg font-semibold text-white">{status}</p>
                <div className="flex mt-4 space-x-4">
                    <button
                        onClick={handleUndo}
                        className="px-4 py-2 bg-gray-600 text-white font-bold rounded hover:bg-gray-700"
                    >
                        Undo Move
                    </button>
                </div>
            </div>
            <div className="ml-8 flex flex-col w-[400px] bg-[#302E2B] border border-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold text-lg text-center mb-2 text-green-400">White Moves</h3>
                <div className="flex flex-col h-80 overflow-y-auto">
                    <div className="flex">
                        <div className="flex flex-col w-1/2 pr-2">
                            <h4 className="font-semibold text-center text-green-400 mb-1">White Moves</h4>
                            <ul className="list-disc pl-5">
                                {whiteMoves.map((move, index) => {
                                    const pieceType = move.charAt(0).toLowerCase();
                                    return (
                                        <li key={index} className="py-1 hover:bg-blue-600 transition flex items-center">
                                            {getPieceIcon(pieceType, 'white')}
                                            <span className="ml-2 text-white">{move}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="flex flex-col w-1/2 pl-2">
                            <h4 className="font-semibold text-center text-green-400 mb-1">Black Moves</h4>
                            <ul className="list-disc pl-5">
                                {blackMoves.map((move, index) => {
                                    const pieceType = move.charAt(0).toLowerCase();
                                    return (
                                        <li key={index} className="py-1 hover:bg-blue-600 transition flex items-center">
                                            {getPieceIcon(pieceType, 'black')}
                                            <span className="ml-2 text-white">{move}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col p-4 border-t mt-2">
                    <h3 className="font-bold text-lg text-center text-white">Chat Section</h3>
                    <p className="text-center text-gray-500">Chat functionality coming soon...</p>
                </div>
            </div>
        </div>
    );
}

export default ChessGame;
