import "./App.css";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [isDraw, setIsDraw] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // 👈 new

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return null;
  }

  useEffect(() => {
    const result = calculateWinner(squares);

    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
      setShowConfetti(true); // 🎉 show confetti

      const audio = new Audio("/win.wav");
      audio.play();
    } else if (!result && squares.every(square => square !== null)) {
      setIsDraw(true);

      const audio = new Audio("/draw.wav");
      audio.play();
    }
  }, [squares]);

  const handleClick = (i) => {
    if (squares[i] || winner || isDraw) return;

    const clickSound = new Audio("/click-sound.mp3");
    clickSound.play();

    const nextSquares = squares.slice();
    nextSquares[i] = isXTurn ? "X" : "O";
    setSquares(nextSquares);
    setIsXTurn(!isXTurn);
  };

  function restartGame() {
    setSquares(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
    setShowConfetti(false); // 🛑 stop confetti

    // Stop any sounds
    const victorySound = new Audio("/win.wav");
    victorySound.pause();
    victorySound.currentTime = 0;

    const drawSound = new Audio("/draw.wav");
    drawSound.pause();
    drawSound.currentTime = 0;
  }

  return (
    <div className="app">
      {showConfetti && <Confetti />} {/* 👈 controlled by state */}

      <h1 className="title">Tic Tac Toe</h1>
      <p>
        {winner
          ? `Winner: ${winner} 🎉`
          : isDraw
          ? "It's a Draw! 🤝"
          : `Next Player: ${isXTurn ? "Player X Turn" : "Player O Turn"}`}
      </p>

      <div className="board">
        {squares.map((value, i) => (
          <button
            key={i}
            className={`square ${winningLine.includes(i) ? "highlight" : ""}`}
            onClick={() => handleClick(i)}
            disabled={winner !== null || isDraw}
          >
            {value}
          </button>
        ))}
      </div>

      <button className="restart-btn" onClick={restartGame}>
        Restart
      </button>
    </div>
  );
}

export default TicTacToe;
