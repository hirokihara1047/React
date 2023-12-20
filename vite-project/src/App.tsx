import { useState } from 'react'
import './App.css'

interface SquareProps {
  //squareの型定義
  value: number;
  onSquareClick: () => void;
}


function Square({ value, onSquareClick }: SquareProps) {
  return (
    //ボタンコンポーネント。盤面に並べる
    <button className='square' onClick={onSquareClick}>{value}</button>
  );
}

function Borad({ xIsNext, squares, onPlay }: any) {
  function handleClick(i: number) {
    if (squares[i] || caluculateWinner(squares)) {//盤面判定
      return;
    }

    const nextSquares = squares.slice();//盤面情報を一時保持
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //勝者
  const winner = caluculateWinner(squares);
  //ゲームが終了した場合に勝者を表示し、ゲームが続行中の場合は、次がどちらの手番なのか表示する。
  let status;
  if (winner) {
    status = "Winner : " + winner;  //勝者表示
  } else {
    status = "Next player:" + (xIsNext ? "X" : "O");//次プレイヤー表示
  }
  return (
    <>
      <div className='status'>{status}</div>
      <div className='board-row'>
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className='board-row'>
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className='board-row'>
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  //現在の番手
  const [xIsNext, setXIsNext] = useState(true);
  //着手の履歴
  const [history, setHistory] = useState([Array(9).fill(null)]);
  //現在のユーザーが何番手の着手か
  const [currentMove, setCurrentMove] = useState(0);
  //現在の場面レンダー
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: any) {
    const nextHistory = [...history.slice(0,currentMove + 1) , nextSquares];//...history←スプレッド構文
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove: any) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }


  const moves = history.map((squares:any, move:any) => {
    let description;
    if (move > 0) {
      description = 'Go to move#' + move;
    } else {
      description = 'Go to game start';
    }
    console.log(move);
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Borad xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

//勝者判定
function caluculateWinner(squares: Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  //linesのいずれかにすべて〇orXになる
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game
