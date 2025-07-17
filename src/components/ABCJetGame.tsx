import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import cityScape from '@/assets/cyberpunk-cityscape.jpg';
import spaceshipImg from '@/assets/neon-spaceship.png';

interface GameState {
  ship: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  bullets: Array<{
    x: number;
    y: number;
    id: number;
  }>;
  letters: Array<{
    x: number;
    y: number;
    char: string;
    id: number;
  }>;
  score: number;
  nextIndex: number;
  gameStarted: boolean;
  gameWidth: number;
  gameHeight: number;
}

const ABCJetGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const lastLetterSpawnRef = useRef<number>(0);
  const bulletIdRef = useRef<number>(0);
  const letterIdRef = useRef<number>(0);
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const [gameState, setGameState] = useState<GameState>({
    ship: {
      x: 0,
      y: 0,
      width: 60,
      height: 60,
    },
    bullets: [],
    letters: [],
    score: 12,
    nextIndex: 4, // Starting with 'E' as next letter
    gameStarted: false,
    gameWidth: 0,
    gameHeight: 0,
  });

  // Initialize game dimensions
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setGameState(prev => ({
        ...prev,
        gameWidth: width,
        gameHeight: height,
        ship: {
          ...prev.ship,
          x: width / 2 - prev.ship.width / 2,
          y: height - 150,
        }
      }));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Game loop
  const gameLoop = useCallback((currentTime: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    const bgImg = new Image();
    bgImg.src = cityScape;
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // Draw spaceship
    const shipImg = new Image();
    shipImg.src = spaceshipImg;
    ctx.drawImage(shipImg, gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);

    // Update game state
    setGameState(prev => {
      let newState = { ...prev };
      
      // Update bullets
      newState.bullets = newState.bullets.map(bullet => ({
        ...bullet,
        y: bullet.y - 8
      })).filter(bullet => bullet.y > -10);

      // Update letters
      newState.letters = newState.letters.map(letter => ({
        ...letter,
        y: letter.y + 2
      })).filter(letter => letter.y < newState.gameHeight + 50);

      // Spawn new letters
      if (currentTime - lastLetterSpawnRef.current > 1300) {
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        newState.letters = [...newState.letters, {
          x: Math.random() * (newState.gameWidth - 40),
          y: -40,
          char,
          id: letterIdRef.current++
        }];
        lastLetterSpawnRef.current = currentTime;
      }

      // Check collisions
      let newScore = newState.score;
      let newNextIndex = newState.nextIndex;
      
      // Bullet-letter collisions
      const remainingBullets = newState.bullets.filter(bullet => {
        const hitLetter = newState.letters.find(letter => 
          bullet.x > letter.x && bullet.x < letter.x + 30 &&
          bullet.y < letter.y && bullet.y > letter.y - 30
        );
        return !hitLetter;
      });

      const remainingLetters = newState.letters.filter(letter => {
        const hitByBullet = newState.bullets.find(bullet => 
          bullet.x > letter.x && bullet.x < letter.x + 30 &&
          bullet.y < letter.y && bullet.y > letter.y - 30
        );
        return !hitByBullet;
      });

      // Ship-letter collisions
      const lettersAfterShipCollision = remainingLetters.filter(letter => {
        const hitShip = letter.x < newState.ship.x + newState.ship.width &&
                      letter.x + 30 > newState.ship.x &&
                      letter.y > newState.ship.y &&
                      letter.y < newState.ship.y + newState.ship.height;
        
        if (hitShip && letter.char === alphabet[newState.nextIndex]) {
          newScore++;
          newNextIndex = (newNextIndex + 1) % alphabet.length;
        }
        
        return !hitShip;
      });

      return {
        ...newState,
        bullets: remainingBullets,
        letters: lettersAfterShipCollision,
        score: newScore,
        nextIndex: newNextIndex
      };
    });

    // Draw bullets
    gameState.bullets.forEach(bullet => {
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(bullet.x, bullet.y - 20);
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw letters
    gameState.letters.forEach(letter => {
      ctx.font = '36px Courier New';
      ctx.fillStyle = '#00ffff';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 20;
      ctx.fillText(letter.char, letter.x, letter.y);
      ctx.shadowBlur = 0;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]);

  // Start game loop
  useEffect(() => {
    if (gameState.gameStarted && canvasRef.current) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameStarted, gameLoop]);

  // Control handlers
  const moveLeft = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ship: {
        ...prev.ship,
        x: Math.max(prev.ship.x - 30, 0)
      }
    }));
  }, []);

  const moveRight = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      ship: {
        ...prev.ship,
        x: Math.min(prev.ship.x + 30, prev.gameWidth - prev.ship.width)
      }
    }));
  }, []);

  const shoot = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      bullets: [...prev.bullets, {
        x: prev.ship.x + prev.ship.width / 2,
        y: prev.ship.y,
        id: bulletIdRef.current++
      }]
    }));
  }, []);

  // Prevent default touch behaviors
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchstart', preventScroll);
    };
  }, []);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true
    }));
  };

  if (!gameState.gameStarted) {
    return (
      <div className="game-container flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="neon-title text-6xl mb-4">ABC JET</h1>
          <p className="neon-text text-xl">
            Shoot the letters in alphabetical order!
          </p>
          <button
            onClick={startGame}
            className="control-btn w-32 h-16 text-xl neon-text"
          >
            START
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={gameState.gameWidth}
        height={gameState.gameHeight}
        className="game-canvas"
      />
      
      {/* UI Overlay */}
      <div className="game-ui">
        <div className="game-score">SCORE: {gameState.score}</div>
        <div className="game-score">NEXT: {alphabet[gameState.nextIndex]}</div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        <button
          className="control-btn"
          onTouchStart={moveLeft}
          onMouseDown={moveLeft}
        >
          <ChevronLeft className="w-6 h-6 text-secondary" />
        </button>
        
        <button
          className="control-btn"
          onTouchStart={shoot}
          onMouseDown={shoot}
        >
          <Zap className="w-6 h-6 text-primary" />
        </button>
        
        <button
          className="control-btn"
          onTouchStart={moveRight}
          onMouseDown={moveRight}
        >
          <ChevronRight className="w-6 h-6 text-secondary" />
        </button>
      </div>
    </div>
  );
};

export default ABCJetGame;