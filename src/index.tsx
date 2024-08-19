import React from 'react';
import ReactDOM from 'react-dom/client';
import { useState, useEffect } from 'react';
import './index.css';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'STOP';

function App() {
  const [snake, setSnake] = useState<Array<[number, number]>>([[50, 50]]);
  const [food, setFood] = useState<[number, number]>([50, 30]);
  const [direction, setDirection] = useState<Direction>('STOP');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [firstGame, setFirstGame] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [prevDirection, setPrevDirection] = useState<Direction>('UP');
  const [dark, setDark] = useState<boolean>(false);
  const darkModeHandler = () => {
    setDark(!dark);
    document.body.classList.toggle('dark');
  }
  useEffect(() => {
    if (gameOver || firstGame) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
        case 'w': 
          if (prevDirection !== 'DOWN') {
            setDirection('UP');
          }
          break;
        case 'ArrowDown':
        case 's': 
          if (prevDirection !== 'UP') {
            setDirection('DOWN');
          }
          break;
        case 'ArrowLeft':
        case 'a': 
          if (prevDirection !== 'RIGHT') {
            setDirection('LEFT');
          }
          break;
        case 'ArrowRight':
        case 'd': 
          if (prevDirection !== 'LEFT') {
            setDirection('RIGHT');
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, prevDirection, gameOver, firstGame]);
  useEffect(() => {
    const timer = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        let head = [...newSnake[0]];
  
        switch (direction) {
          case 'UP':
            head[1] -= 2;
            break;
          case 'DOWN':
            head[1] += 2;
            break;
          case 'LEFT':
            head[0] -= 2;
            break;
          case 'RIGHT':
            head[0] += 2;
            break;
          case 'STOP':
            clearInterval(timer);
            break;
        }
        setPrevDirection(direction);
        if (head[0] < 0 || head[0] > 98 || head[1] < 0 || head[1] > 98) {
          setGameOver(true);
          setDirection('STOP');
          clearInterval(timer);
          return prevSnake;
        }
        if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          setDirection('STOP');
          clearInterval(timer);
          return prevSnake;
        }

        if (Math.abs(head[0] - food[0]) < 2 && Math.abs(head[1] - food[1]) < 2) {
          let newFood: [number, number];
          const isFoodOnSnake = (food: [number, number]) => newSnake.some(segment => segment[0] === food[0] && segment[1] === food[1]);
          do {
            newFood = [Math.floor(Math.random() * 49) * 2, Math.floor(Math.random() * 49) * 2];
          } while (isFoodOnSnake(newFood));
          setScore(score + 1);
          setFood(newFood);
          newSnake.unshift([head[0], head[1]]);
        } else {
          newSnake.pop();
        }

        newSnake.unshift(head as [number, number]);
  
        return newSnake;
      });
    }, 50);
  
    return () => {
      clearInterval(timer);
    };
  }, [direction, food, gameOver, score, firstGame]);
  return (
    <div className='flex items-center flex-col h-screen bg-gray-100 dark:bg-gray-900 dark:text-white'>
      <header className='text-center'>
      <button onClick={()=> darkModeHandler()}>
            { dark ? 'Light Mode' : 'Dark Mode' }
          </button>
        <h1>Snake Game</h1>
        <h2>Score: {score}</h2> 
      </header>
      <div className='bg-white dark:bg-gray-700 relative min-h-96 min-w-96 h-96 w-96 border border-black'>
        {snake.map((segment, index) => (
          <div
            key={index}
            className='absolute w-2 h-2 bg-green-600 transition-all duration-75 ease-linear'
            style={{ left: `${segment[0] > 97.9 ? 97.9 : segment[0]}%`, top: `${segment[1] > 97.9 ? 97.9 : segment[1]}%` }}
          />
        ))}
        <div
          className='absolute w-2 h-2 bg-red-600 rounded-full'
          style={{ left: `${food[0] > 97.9 ? 97.9 : food[0]}%`, top: `${food[1] > 97.9 ? 97.9 : food[1]}%` }}
        />
        <div>
          {(gameOver || firstGame) && (
            <div className='absolute bg-black bg-opacity-50 w-full h-full flex flex-col items-center justify-center'>
              <h1 className='text-3xl text-white'>{firstGame ? 'Snake' : 'Game Over'}</h1>
              <button
                onClick={() => {
                  setSnake([[50, 50]]);
                  setFood([50, 30]);
                  setDirection('UP');
                  setGameOver(false);
                  setScore(0);
                  setFirstGame(false);
                }}
                className='bg-green-600 text-sm text-white py-1 px-4 rounded  mt-2'>
                {firstGame ? 'Start' : 'Restart'}
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
