import { useState } from "react"
import confetti from "canvas-confetti"

const TURNS = {
  X: '✕',
  O: '○',
}


const Square = ({ children, isSelected, updateBoard, index}) => {
  const className = `square ${isSelected ? 'is-selected' : ''}`
  
  const handleClick = () => {
    updateBoard(index)
  }
  
  return (
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  )
}

const WINNER_COMBINATIONS = [
  // Horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal
  [0, 4, 8],
  [2, 4, 6],
]

function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  
  const [turn, setTurn] = useState(TURNS.X)
  // null es que no hay ganador, false es que hay empate
  const [winner, setWinner] = useState(null) 

  const checkWinner = (boardToCheck) => {
    for (const combination of WINNER_COMBINATIONS) {
      const [a, b, c] = combination
      if (boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] && 
        boardToCheck[a] === boardToCheck[c]) {
          return boardToCheck[a]
        }
      }
      // Si no hay ganador
      return null
    }

    const resetGame = () => {
      setBoard(Array(9).fill(null))
      setTurn(TURNS.X)
      setWinner(null)
    }

    const checkEndGame = (newBoard) => {

      return newBoard.every((square) => square !== null)
    }
  
  const updateBoard = (index) => {
    // No actualizar si ya hay un valor
    if (board[index] || winner) return
    // Actulizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // Cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //revisar si hay ganador
    const newWinner = checkWinner(newBoard)
    if(newWinner){
      confetti()
      // La actualizacion de los estado en React son Asincronos
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // Empate
    }
  }
  
  return (
  <main className="board">
   <h1>Tic Tac Toe</h1>
   <button onClick={resetGame}>Reset Game</button>
   <section className="game">
    {
      board.map((value, index) => {
        return (
        <Square 
        key={index}
        index={index}
        updateBoard={updateBoard}
        >
          {value}
        </Square>
        )
      })
      }
    </section>

    <section className="turn">
      <Square isSelected ={turn === TURNS.X}>
        {TURNS.X}
      </Square>
      <Square isSelected ={turn === TURNS.O}>
        {TURNS.O}
      </Square>
    </section>

    {
      winner !== null && (
        <section className="winner">
        <div className = "text">
          <h2>
            {
              winner === false
              ? 'Empate'
              : `Ganador: ${winner}`
            }

          </h2>

          <header className="win">
            {winner && <Square>{winner}</Square>}

          </header>

          <footer> 
          <button onClick={resetGame}>Empezar de nuevo</button>

          </footer>
        </div>
        </section>
      )
    }
  </main>
  )
}

export default App
