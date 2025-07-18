import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import cityScape from '@/assets/cyberpunk-cityscape.jpg';
import back1 from '@/assets/Back1.png';
import back2 from '@/assets/back2.png';
import spaceshipImg from '@/assets/spaceship.png';
import shootButtonImg from '@/assets/ShootButton.png';
import shootBulletImg from '@/assets/ShootBullet.png';
import puX2Img from '@/assets/PUX2.png';
import puShieldImg from '@/assets/PUshild.png';
import puLiveImg from '@/assets/PULive.png';

// Add CSS animations for the shoot button with mobile optimizations
const shootButtonStyles = `
  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  }
  
  .game-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .game-ui {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 20;
    pointer-events: none;
  }
  
  .game-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    display: flex !important;
    justify-content: space-between;
    align-items: flex-end;
    padding: 20px;
    z-index: 30;
    pointer-events: auto;
  }
  
  .mobile-joystick {
    pointer-events: auto !important;
    z-index: 40;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .mobile-shoot-btn {
    pointer-events: auto;
    z-index: 40;
  }
  
  @keyframes shoot-button-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.08); }
    100% { transform: scale(1); }
  }
  
  @keyframes shoot-ring-pulse {
    0% { opacity: 1; transform: scale(1.3); }
    50% { opacity: 0.7; transform: scale(1.5); }
    100% { opacity: 1; transform: scale(1.3); }
  }
  
  @keyframes shoot-ring-spin {
    0% { transform: scale(1.15) rotate(0deg); }
    100% { transform: scale(1.15) rotate(360deg); }
  }
  
  @keyframes shoot-sparks {
    0% { opacity: 0.8; transform: scale(1); }
    100% { opacity: 1; transform: scale(1.1); }
  }

  /* Mobile-specific optimizations */
  @media (max-width: 768px) {
    .game-container {
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    .game-controls {
      height: 150px;
      padding: 15px;
      display: flex !important;
      justify-content: space-between !important;
      align-items: flex-end !important;
    }
    
    .neon-title {
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.8),
                   0 0 20px rgba(0, 255, 255, 0.6),
                   0 0 30px rgba(0, 255, 255, 0.4);
    }
    
    .neon-text {
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.8);
    }
    
    .mobile-btn {
      min-height: 44px; /* Apple's recommended minimum touch target */
      min-width: 44px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }
    
    .mobile-ui-panel {
      backdrop-filter: blur(8px);
    }
    
    .control-btn {
      transition: all 0.1s ease;
      min-height: 44px;
    }
    
    .control-btn:active {
      transform: scale(0.95);
    }
    
    @keyframes shoot-button-pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    @keyframes shoot-ring-pulse {
      0% { opacity: 1; transform: scale(1.2); }
      50% { opacity: 0.7; transform: scale(1.4); }
      100% { opacity: 1; transform: scale(1.2); }
    }
    
    @keyframes shoot-ring-spin {
      0% { transform: scale(1.1) rotate(0deg); }
      100% { transform: scale(1.1) rotate(360deg); }
    }
    
    @keyframes shoot-sparks {
      0% { opacity: 0.8; transform: scale(1); }
      100% { opacity: 1; transform: scale(1.05); }
    }
    
    body {
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    
    .game-container {
      touch-action: none;
      -webkit-overflow-scrolling: touch;
    }
  }

  /* Desktop/larger screens */
  @media (min-width: 769px) {
    .mobile-ui-panel {
      backdrop-filter: blur(12px);
    }
    
    .neon-title {
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.8),
                   0 0 30px rgba(0, 255, 255, 0.6),
                   0 0 40px rgba(0, 255, 255, 0.4);
    }
    
    .neon-text {
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
    }
  }

  /* Spaceship start animation */
  @keyframes spaceshipFlyUp {
    0% { 
      transform: translateY(0px) scale(1); 
      opacity: 1; 
      filter: blur(0px) drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));
    }
    30% { 
      transform: translateY(-100px) scale(1.1); 
      opacity: 1; 
      filter: blur(1px) drop-shadow(0 0 30px rgba(0, 255, 255, 1));
    }
    100% { 
      transform: translateY(-600px) scale(1.4); 
      opacity: 0; 
      filter: blur(3px) drop-shadow(0 0 50px rgba(0, 255, 255, 0.3));
    }
  }
  
  @keyframes spaceshipFlyUpLeft {
    0% { 
      transform: translateY(0px) translateX(0px) scale(1) scaleX(-1); 
      opacity: 1; 
      filter: blur(0px) drop-shadow(0 0 20px rgba(0, 255, 255, 0.8));
    }
    30% { 
      transform: translateY(-100px) translateX(0px) scale(1.1) scaleX(-1); 
      opacity: 1; 
      filter: blur(1px) drop-shadow(0 0 30px rgba(0, 255, 255, 1));
    }
    100% { 
      transform: translateY(-600px) translateX(0px) scale(1.4) scaleX(-1); 
      opacity: 0; 
      filter: blur(3px) drop-shadow(0 0 50px rgba(0, 255, 255, 0.3));
    }
  }
  
  /* Mobile spaceship animations */
  @media (max-width: 768px) {
    @keyframes spaceshipFlyUp {
      0% { 
        transform: translateY(0px) scale(1); 
        opacity: 1; 
        filter: blur(0px) drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
      }
      30% { 
        transform: translateY(-100px) scale(1.05); 
        opacity: 1; 
        filter: blur(1px) drop-shadow(0 0 20px rgba(0, 255, 255, 1));
      }
      100% { 
        transform: translateY(-600px) scale(1.2); 
        opacity: 0; 
        filter: blur(3px) drop-shadow(0 0 30px rgba(0, 255, 255, 0.3));
      }
    }
    
    @keyframes spaceshipFlyUpLeft {
      0% { 
        transform: translateY(0px) translateX(0px) scale(1) scaleX(-1); 
        opacity: 1; 
        filter: blur(0px) drop-shadow(0 0 15px rgba(0, 255, 255, 0.8));
      }
      30% { 
        transform: translateY(-100px) translateX(0px) scale(1.05) scaleX(-1); 
        opacity: 1; 
        filter: blur(1px) drop-shadow(0 0 20px rgba(0, 255, 255, 1));
      }
      100% { 
        transform: translateY(-600px) translateX(0px) scale(1.2) scaleX(-1); 
        opacity: 0; 
        filter: blur(3px) drop-shadow(0 0 30px rgba(0, 255, 255, 0.3));
      }
    }
  }
  
  .spaceship-animation {
    animation: spaceshipFlyUp 1.0s ease-in forwards;
    will-change: transform, opacity, filter;
  }
  
  .spaceship-animation-left {
    animation: spaceshipFlyUpLeft 1.0s ease-in forwards;
    will-change: transform, opacity, filter;
  }
  
  .title-fade-out {
    animation: fadeOut 1.0s ease-in forwards;
  }
  
  @keyframes fadeOut {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.8); }
  }
  
  @keyframes fadeIn {
    0% { opacity: 0; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInDown {
    0% { 
      opacity: 0; 
      transform: translateY(-50px) scale(0.8); 
    }
    100% { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  /* Mobile slide animation */
  @media (max-width: 768px) {
    @keyframes slideInDown {
      0% { 
        opacity: 0; 
        transform: translateY(-30px) scale(0.8); 
      }
      100% { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
  }
  
  /* Ensure all buttons work even when console is open */
  button {
    pointer-events: auto !important;
    z-index: 9999 !important;
    position: relative !important;
    min-height: 32px !important;
  }
  
  @media (max-width: 768px) {
    button {
      min-height: 44px !important;
    }
  }
  
  /* Force click events */
  button:active {
    transform: scale(0.95) !important;
  }
`;

// Inject styles into the document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = shootButtonStyles;
  document.head.appendChild(styleElement);
}

// Extend Window interface for debug functions
declare global {
  interface Window {
    gameDebug?: {
      startGame: () => void;
      addLives: (lives: number) => void;
      addScore: (points: number) => void;
      setLetter: (letterIndex: number) => void;
      getGameState: () => GameState;
      showGameOver: () => void;
      reviveGame: () => void;
      help: () => void;
      fixButtons: () => void;
      testWrongCatch: () => { current: { letter: string; index: number }; after: { letter: string; index: number }; goesBack: number };
    };
  }
}

// Mobile detection utility
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
};

// Always show joystick in development/production
const shouldShowJoystick = () => {
  return true; // Always show joystick for better UX
};

// Game configuration
const MAX_STRIKES = 3; // Change this to 5 for 5 strikes mode

// Background images array
const BACKGROUND_IMAGES = [
  { src: cityScape, name: 'cyberpunk-cityscape' },
  { src: back1, name: 'back1' },
  { src: back2, name: 'back2' }
];

// Performance optimization for mobile
const getOptimizedSettings = () => {
  const mobile = isMobile();
  return {
    bulletSpeed: mobile ? 6 : 8,
    letterSpeed: mobile ? 1.5 : 2,
    spawnRate: mobile ? 2000 : 1500,
    maxBullets: mobile ? 15 : 25,
    maxLetters: mobile ? 8 : 12,
    animationQuality: mobile ? 'low' : 'high',
    glowIntensity: mobile ? 0.7 : 1.0,
    powerUpSpeed: mobile ? 2 : 3,
    powerUpSpawnRate: mobile ? 8000 : 6000, // Power-ups spawn every 6-8 seconds
    doubleShotDuration: mobile ? 8000 : 10000, // Double shot lasts 8-10 seconds
    shieldDuration: 10000 // Shield lasts 10 seconds
  };
};

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
  powerUps: Array<{
    x: number;
    y: number;
    type: 'doubleShot' | 'extraLife' | 'shield';
    id: number;
  }>;
  score: number;
  currentLetterIndex: number; // Current letter to catch in ABC order
  penalties: number; // Strike count
  gameStarted: boolean;
  gameOver: boolean;
  gameWidth: number;
  gameHeight: number;
  currentScreen: 'start' | 'instructions' | 'game' | 'gameOver';
  selectedBackgroundIndex: number; // Index of the selected background
  isStartAnimation: boolean; // Animation state for start screen
  doubleShotActive: boolean; // Whether double shot is active
  doubleShotTimeLeft: number; // Time left for double shot effect
  shieldActive: boolean; // Whether shield is active
  shieldTimeLeft: number; // Time left for shield effect
}

interface JoystickProps {
  onMove: (direction: { x: 'left' | 'right' | 'center', y: 'up' | 'down' | 'center' }) => void;
  size?: number;
}

const Joystick: React.FC<JoystickProps> = ({ onMove, size = 120 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });
  const joystickRef = useRef<HTMLDivElement>(null);
  
  // Optimized joystick size for all devices
  const mobileSize = shouldShowJoystick() ? (isMobile() ? Math.min(size, 100) : size) : size;
  const sensitivity = shouldShowJoystick() ? (isMobile() ? 3 : 5) : 5;

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    if (joystickRef.current) {
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      
      // Limit movement to circle with mobile optimization
      const maxDistance = (mobileSize - 40) / 2;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const clampedDistance = Math.min(distance, maxDistance);
      
      const angle = Math.atan2(deltaY, deltaX);
      const x = Math.cos(angle) * clampedDistance;
      const y = Math.sin(angle) * clampedDistance;
      
      setKnobPosition({ x, y });
      
      // Determine direction based on X and Y positions - mobile-optimized sensitivity
      const xDirection = Math.abs(x) > sensitivity ? (x > 0 ? 'right' : 'left') : 'center';
      const yDirection = Math.abs(y) > sensitivity ? (y > 0 ? 'down' : 'up') : 'center';
      
      onMove({ x: xDirection, y: yDirection });
    }
  }, [onMove, size]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !joystickRef.current) return;
    
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    
    // Limit movement to circle with mobile optimization
    const maxDistance = (mobileSize - 40) / 2;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const clampedDistance = Math.min(distance, maxDistance);
    
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;
    
    setKnobPosition({ x, y });
    
    // Determine direction based on X and Y positions - mobile-optimized sensitivity
    const xDirection = Math.abs(x) > sensitivity ? (x > 0 ? 'right' : 'left') : 'center';
    const yDirection = Math.abs(y) > sensitivity ? (y > 0 ? 'down' : 'up') : 'center';
    
    onMove({ x: xDirection, y: yDirection });
  }, [isDragging, onMove, size]);

  const handleEnd = useCallback(() => {
    setIsDragging(false);
    setKnobPosition({ x: 0, y: 0 });
    onMove({ x: 'center', y: 'center' });
  }, [onMove]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    e.preventDefault();
    handleEnd();
  }, [handleEnd]);

  // Add global event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove, { passive: false } as EventListenerOptions);
      document.removeEventListener('touchend', handleTouchEnd, { passive: false } as EventListenerOptions);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={joystickRef}
      className="relative select-none mobile-joystick"
      style={{
        width: mobileSize,
        height: mobileSize,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        border: shouldShowJoystick() ? (isMobile() ? '2px solid #0ff' : '3px solid #0ff') : '3px solid #0ff',
        boxShadow: shouldShowJoystick() 
          ? (isMobile() 
              ? '0 0 15px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.1)'
              : '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)')
          : '0 0 20px rgba(0, 255, 255, 0.5), inset 0 0 20px rgba(0, 255, 255, 0.1)',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full"
        style={{
          width: shouldShowJoystick() ? (isMobile() ? 30 : 40) : 40,
          height: shouldShowJoystick() ? (isMobile() ? 30 : 40) : 40,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${knobPosition.x}px, ${knobPosition.y}px)`,
          boxShadow: shouldShowJoystick() 
            ? (isMobile() 
                ? '0 0 10px rgba(0, 255, 255, 0.8)'
                : '0 0 15px rgba(0, 255, 255, 0.8)')
            : '0 0 15px rgba(0, 255, 255, 0.8)',
          border: shouldShowJoystick() ? (isMobile() ? '1px solid #fff' : '2px solid #fff') : '2px solid #fff',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-cyan-300 font-bold ${shouldShowJoystick() ? (isMobile() ? 'text-xs' : 'text-xs') : 'text-xs'}`}>
          {shouldShowJoystick() ? (isMobile() ? 'MOVE' : 'MOVE') : 'MOVE'}
        </div>
      </div>
    </div>
  );
};

const ABCJetGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const lastLetterSpawnRef = useRef<number>(0);
  const lastCorrectLetterSpawnRef = useRef<number>(0);
  const lastPowerUpSpawnRef = useRef<number>(0);
  const bulletIdRef = useRef<number>(0);
  const letterIdRef = useRef<number>(0);
  const powerUpIdRef = useRef<number>(0);
  const [currentDirection, setCurrentDirection] = useState<{ x: 'left' | 'right' | 'center', y: 'up' | 'down' | 'center' }>({ x: 'center', y: 'center' });
  const [keyboardDirection, setKeyboardDirection] = useState<{ x: 'left' | 'right' | 'center', y: 'up' | 'down' | 'center' }>({ x: 'center', y: 'center' });
  const [isShooting, setIsShooting] = useState(false);
  const shootIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const [adType, setAdType] = useState<'short' | 'long'>('short');
  const adIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Preload images
  const backgroundImagesRef = useRef<HTMLImageElement[]>([]);
  const spaceshipImageRef = useRef<HTMLImageElement | null>(null);
  const bulletImageRef = useRef<HTMLImageElement | null>(null);
  const puX2ImageRef = useRef<HTMLImageElement | null>(null);
  const puShieldImageRef = useRef<HTMLImageElement | null>(null);
  const puLiveImageRef = useRef<HTMLImageElement | null>(null);
  
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  
  const [gameState, setGameState] = useState<GameState>({
    ship: {
      x: 0,
      y: 0,
      width: isMobile() ? 60 : 80,
      height: isMobile() ? 60 : 80,
    },
    bullets: [],
    letters: [],
    powerUps: [],
    score: 0,
    currentLetterIndex: 0, // Starting with 'A'
    penalties: 0,
    gameStarted: false,
    gameOver: false,
    gameWidth: 0,
    gameHeight: 0,
    currentScreen: 'start',
    selectedBackgroundIndex: Math.floor(Math.random() * BACKGROUND_IMAGES.length), // Random background selection
    isStartAnimation: false, // Animation state for start screen
    doubleShotActive: false,
    doubleShotTimeLeft: 0,
    shieldActive: false,
    shieldTimeLeft: 0,
  });

  // Load images once
  useEffect(() => {
    // Load all background images
    BACKGROUND_IMAGES.forEach((bgData, index) => {
      const bgImg = new Image();
      bgImg.onload = () => {
        backgroundImagesRef.current[index] = bgImg;
      };
      bgImg.src = bgData.src;
    });
    
        // Load other images
    const shipImg = new Image();
    const bulletImg = new Image();
    const puX2Image = new Image();
    const puShieldImage = new Image();
    const puLiveImage = new Image();
    
    shipImg.onload = () => {
      spaceshipImageRef.current = shipImg;
    };
    
    bulletImg.onload = () => {
      bulletImageRef.current = bulletImg;
    };
    
    puX2Image.onload = () => {
      puX2ImageRef.current = puX2Image;
    };
    
    puShieldImage.onload = () => {
      puShieldImageRef.current = puShieldImage;
    };
    
    puLiveImage.onload = () => {
      puLiveImageRef.current = puLiveImage;
    };
    
    shipImg.src = spaceshipImg;
    bulletImg.src = shootBulletImg;
    puX2Image.src = puX2Img;
    puShieldImage.src = puShieldImg;
    puLiveImage.src = puLiveImg;
  }, []);

  // Movement will be handled directly in the game loop for ultra-smooth movement

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
          y: height - (isMobile() ? 200 : 250), // Mobile-optimized positioning
        }
      }));
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Keyboard movement support for desktop (always enabled for better UX)
  useEffect(() => {
    // Enable keyboard movement on all devices for better accessibility
    
    const keysPressed = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      const key = e.key.toLowerCase();
      keysPressed.add(key);
      
      // Update keyboard direction based on pressed keys
      let x: 'left' | 'right' | 'center' = 'center';
      let y: 'up' | 'down' | 'center' = 'center';
      
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        x = 'left';
      } else if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        x = 'right';
      }
      
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        y = 'up';
      } else if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        y = 'down';
      }
      
      setKeyboardDirection({ x, y });
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysPressed.delete(key);
      
      // Update keyboard direction based on remaining pressed keys
      let x: 'left' | 'right' | 'center' = 'center';
      let y: 'up' | 'down' | 'center' = 'center';
      
      if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
        x = 'left';
      } else if (keysPressed.has('d') || keysPressed.has('arrowright')) {
        x = 'right';
      }
      
      if (keysPressed.has('w') || keysPressed.has('arrowup')) {
        y = 'up';
      } else if (keysPressed.has('s') || keysPressed.has('arrowdown')) {
        y = 'down';
      }
      
      setKeyboardDirection({ x, y });
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.gameOver]);

  // Game loop with mobile optimizations
  const gameLoop = useCallback((currentTime: number) => {
    if (!canvasRef.current || gameState.gameOver) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Get mobile-optimized settings
    const settings = getOptimizedSettings();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background only if image is loaded
    const selectedBackground = backgroundImagesRef.current[gameState.selectedBackgroundIndex];
    if (selectedBackground) {
      ctx.drawImage(selectedBackground, 0, 0, canvas.width, canvas.height);
    }

    // Draw spaceship only if image is loaded
    if (spaceshipImageRef.current) {
      // Draw shield circle if shield is active
      if (gameState.shieldActive) {
        const centerX = gameState.ship.x + gameState.ship.width / 2;
        const centerY = gameState.ship.y + gameState.ship.height / 2;
        const shieldRadius = ((gameState.ship.width + gameState.ship.height) / 2 + (isMobile() ? 15 : 20)) * 0.5;
        
        // Draw outer shield glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, shieldRadius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = isMobile() ? 2 : 3;
        ctx.shadowColor = '#00aaff';
        ctx.shadowBlur = isMobile() ? 20 : 25;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        
        // Draw inner shield ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, shieldRadius - 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = isMobile() ? 10 : 15;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        
        // Draw animated shield particles
        const time = Date.now() * 0.002;
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2 / 8) + time;
          const particleX = centerX + Math.cos(angle) * shieldRadius;
          const particleY = centerY + Math.sin(angle) * shieldRadius;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, isMobile() ? 2 : 3, 0, 2 * Math.PI);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00aaff';
          ctx.shadowBlur = isMobile() ? 8 : 12;
          ctx.globalAlpha = 0.7 + Math.sin(time * 3 + i) * 0.3;
          ctx.fill();
        }
        
        // Reset shadow and alpha
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
      
      // Add subtle outer white glow (30% increase)
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = isMobile() ? 39 : 52;
      ctx.globalAlpha = 0.25;
      ctx.drawImage(spaceshipImageRef.current, gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);
      
      // Add medium white glow (30% increase)
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = isMobile() ? 23 : 33;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(spaceshipImageRef.current, gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);
      
      // Draw the main spaceship with bright white glow (30% increase)
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = isMobile() ? 16 : 20;
      ctx.globalAlpha = 1;
      ctx.drawImage(spaceshipImageRef.current, gameState.ship.x, gameState.ship.y, gameState.ship.width, gameState.ship.height);
      
      // Reset shadow
      ctx.shadowBlur = 0;
    }

    // Update game state
    setGameState(prev => {
      if (prev.gameOver) return prev;
      
      let newState = { ...prev };
      
      // Update ship position based on joystick and keyboard (ultra-smooth movement)
      let newShipX = newState.ship.x;
      let newShipY = newState.ship.y;
      
      // Combine joystick and keyboard direction (keyboard overrides joystick on desktop)
      const activeDirection = shouldShowJoystick() ? {
        x: keyboardDirection.x !== 'center' ? keyboardDirection.x : currentDirection.x,
        y: keyboardDirection.y !== 'center' ? keyboardDirection.y : currentDirection.y,
      } : currentDirection;
      
      // Ultra-smooth movement - mobile-optimized
      const moveSpeed = Math.min(deltaTime * (isMobile() ? 0.3 : 0.4), isMobile() ? 10 : 12); // Mobile-optimized speed
      if (activeDirection.x === 'left') {
        newShipX = Math.max(newState.ship.x - moveSpeed, 0);
      } else if (activeDirection.x === 'right') {
        newShipX = Math.min(newState.ship.x + moveSpeed, newState.gameWidth - newState.ship.width);
      }
      
      // Vertical movement - integrated into game loop for maximum smoothness
      if (activeDirection.y === 'up') {
        newShipY = Math.max(newState.ship.y - moveSpeed, newState.gameHeight * 0.3);
      } else if (activeDirection.y === 'down') {
        newShipY = Math.min(newState.ship.y + moveSpeed, newState.gameHeight - newState.ship.height - 20);
      }
      
      // Update ship position
      newState.ship = {
        ...newState.ship,
        x: newShipX,
        y: newShipY
      };
      
      // Update bullets with mobile-optimized speed
      newState.bullets = newState.bullets.map(bullet => ({
        ...bullet,
        y: bullet.y - settings.bulletSpeed
      })).filter(bullet => bullet.y > -10)
      .slice(0, settings.maxBullets); // Limit bullets for mobile performance

      // Update letters with mobile-optimized speed
      newState.letters = newState.letters.map(letter => ({
        ...letter,
        y: letter.y + settings.letterSpeed
      })).filter(letter => letter.y < newState.gameHeight + 50)
      .slice(0, settings.maxLetters); // Limit letters for mobile performance

      // Spawn new letters with mobile-optimized spawn rate
      if (currentTime - lastLetterSpawnRef.current > settings.spawnRate) {
        const correctLetter = alphabet[newState.currentLetterIndex];
        const timeSinceCorrectLetter = currentTime - lastCorrectLetterSpawnRef.current;
        
        // Force spawn correct letter if it hasn't appeared for 10 seconds
        let char;
        if (timeSinceCorrectLetter > 10000) { // 10 seconds = 10000 milliseconds
          char = correctLetter;
          lastCorrectLetterSpawnRef.current = currentTime;
        } else {
          char = alphabet[Math.floor(Math.random() * alphabet.length)];
          // Update the correct letter spawn time if we randomly spawned it
          if (char === correctLetter) {
            lastCorrectLetterSpawnRef.current = currentTime;
          }
        }
        
        newState.letters = [...newState.letters, {
          x: Math.random() * (newState.gameWidth - 50),
          y: -50,
          char,
          id: letterIdRef.current++
        }];
        lastLetterSpawnRef.current = currentTime;
      }

      // Check collisions
      let newScore = newState.score;
      let newCurrentLetterIndex = newState.currentLetterIndex;
      let newPenalties = newState.penalties;
      
      // Bullet-letter collisions (shoot non-ABC letters for 1 point) - mobile-optimized
      const hitLettersByBullets = new Set();
      const bulletHitbox = isMobile() ? 8 : 10;
      const letterHitbox = isMobile() ? 40 : 50;
      newState.bullets.forEach(bullet => {
        const hitLetter = newState.letters.find(letter => 
          bullet.x - bulletHitbox < letter.x + letterHitbox && bullet.x + bulletHitbox > letter.x &&
          bullet.y - bulletHitbox < letter.y + letterHitbox && bullet.y + bulletHitbox > letter.y
        );
        if (hitLetter && !hitLettersByBullets.has(hitLetter.id)) {
          hitLettersByBullets.add(hitLetter.id);
          // Only get points for shooting letters that are NOT the current target
          if (hitLetter.char !== alphabet[newCurrentLetterIndex]) {
            newScore += 1;
          }
        }
      });

      // Remove hit letters and corresponding bullets
      const remainingLetters = newState.letters.filter(letter => 
        !hitLettersByBullets.has(letter.id)
      );
      const remainingBullets = newState.bullets.filter(bullet => {
        const hitLetter = newState.letters.find(letter => 
          bullet.x - bulletHitbox < letter.x + letterHitbox && bullet.x + bulletHitbox > letter.x &&
          bullet.y - bulletHitbox < letter.y + letterHitbox && bullet.y + bulletHitbox > letter.y
        );
        return !hitLetter || hitLettersByBullets.has(hitLetter.id);
      });

      // Ship-letter collisions (catch letters in ABC order) - mobile-optimized
      const lettersAfterShipCollision = remainingLetters.filter(letter => {
        const hitShip = letter.x < newState.ship.x + newState.ship.width &&
                      letter.x + letterHitbox > newState.ship.x &&
                      letter.y + letterHitbox > newState.ship.y &&
                      letter.y < newState.ship.y + newState.ship.height;
        
        if (hitShip) {
          if (letter.char === alphabet[newCurrentLetterIndex]) {
            // Correct letter caught - 2 points and move to next letter
            newScore += 2;
            newCurrentLetterIndex = (newCurrentLetterIndex + 1) % alphabet.length;
          } else {
            // Wrong letter caught - check if shield is active
            if (newState.shieldActive) {
              // Shield protects - no penalty, just consume the letter
              // Shield stays active
            } else {
              // No shield - penalty and go back 2 letters
              newPenalties += 1;
              newCurrentLetterIndex = Math.max(0, newCurrentLetterIndex - 2); // Go back 2 letters (minimum A)
              
              // Check if game over (max strikes reached)
              if (newPenalties >= MAX_STRIKES) {
                newState.gameOver = true;
                // Keep currentScreen as 'game' to show overlay
              }
            }
          }
        }
        
        return !hitShip;
      });

      // Update power-ups
      newState.powerUps = newState.powerUps.map(powerUp => ({
        ...powerUp,
        y: powerUp.y + settings.powerUpSpeed
      })).filter(powerUp => powerUp.y < newState.gameHeight + 60);

      // Spawn new power-ups
      if (currentTime - lastPowerUpSpawnRef.current > settings.powerUpSpawnRate) {
        const rand = Math.random();
        const type = rand < 0.33 ? 'doubleShot' : rand < 0.66 ? 'extraLife' : 'shield';
        newState.powerUps = [...newState.powerUps, {
          x: Math.random() * (newState.gameWidth - 60),
          y: -60,
          type,
          id: powerUpIdRef.current++
        }];
        lastPowerUpSpawnRef.current = currentTime;
      }

      // Check power-up collisions
      const hitPowerUps = new Set();
      const powerUpHitbox = isMobile() ? 40 : 50;
      newState.powerUps.forEach(powerUp => {
        const hitShip = powerUp.x < newState.ship.x + newState.ship.width &&
                        powerUp.x + powerUpHitbox > newState.ship.x &&
                        powerUp.y + powerUpHitbox > newState.ship.y &&
                        powerUp.y < newState.ship.y + newState.ship.height;
        
                 if (hitShip) {
           hitPowerUps.add(powerUp.id);
           if (powerUp.type === 'doubleShot') {
             newState.doubleShotActive = true;
             newState.doubleShotTimeLeft = settings.doubleShotDuration;
           } else if (powerUp.type === 'extraLife') {
             newPenalties = Math.max(0, newPenalties - 1);
           } else if (powerUp.type === 'shield') {
             newState.shieldActive = true;
             newState.shieldTimeLeft = settings.shieldDuration;
           }
         }
      });

      // Remove hit power-ups
      const remainingPowerUps = newState.powerUps.filter(powerUp => !hitPowerUps.has(powerUp.id));

      return {
        ...newState,
        bullets: remainingBullets,
        letters: lettersAfterShipCollision,
        powerUps: remainingPowerUps,
        score: newScore,
        currentLetterIndex: newCurrentLetterIndex,
        penalties: newPenalties,
        doubleShotTimeLeft: Math.max(0, newState.doubleShotTimeLeft - deltaTime),
        doubleShotActive: newState.doubleShotTimeLeft > 0,
        shieldTimeLeft: Math.max(0, newState.shieldTimeLeft - deltaTime),
        shieldActive: newState.shieldTimeLeft > 0
      };
    });

    // Draw bullets with mobile optimizations
    gameState.bullets.forEach(bullet => {
      if (bulletImageRef.current) {
        const bulletSize = isMobile() ? 16 : 20;
        // Add glowing effect around the bullet (reduced for mobile)
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = isMobile() ? 10 : 15;
        ctx.drawImage(bulletImageRef.current, bullet.x - bulletSize/2, bullet.y - bulletSize/2, bulletSize, bulletSize);
        ctx.shadowBlur = 0;
      }
    });

    // Draw letters with mobile-optimized effects
    gameState.letters.forEach(letter => {
      const isTargetLetter = letter.char === alphabet[gameState.currentLetterIndex];
      
      // Mobile-optimized font size
      const fontSize = isMobile() ? 36 : 47;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = '#ff0000'; // Red color
      ctx.shadowColor = '#ff0000'; // Red glow
      ctx.shadowBlur = isMobile() ? 15 : 25; // Reduced glow for mobile
      ctx.fillText(letter.char, letter.x, letter.y + (isMobile() ? 30 : 40));
      
      // Add extra bright border for target letter
      if (isTargetLetter) {
        ctx.strokeStyle = '#ffff00'; // Yellow border
        ctx.lineWidth = isMobile() ? 2 : 3;
        ctx.shadowBlur = 0;
        ctx.strokeText(letter.char, letter.x, letter.y + (isMobile() ? 30 : 40));
        
        // Add extra glow for target letter (reduced for mobile)
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = isMobile() ? 20 : 30;
        ctx.fillText(letter.char, letter.x, letter.y + (isMobile() ? 30 : 40));
      }
      ctx.shadowBlur = 0;
    });

        // Draw power-ups
    gameState.powerUps.forEach(powerUp => {
      const powerUpSize = isMobile() ? 40 : 50;
      
      if (powerUp.type === 'doubleShot' && puX2ImageRef.current) {
        // Add glow effect
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = isMobile() ? 15 : 20;
        ctx.drawImage(puX2ImageRef.current, powerUp.x, powerUp.y, powerUpSize, powerUpSize);
        ctx.shadowBlur = 0;
      } else if (powerUp.type === 'extraLife' && puLiveImageRef.current) {
        // Add glow effect
        ctx.shadowColor = '#ff0044';
        ctx.shadowBlur = isMobile() ? 15 : 20;
        ctx.drawImage(puLiveImageRef.current, powerUp.x, powerUp.y, powerUpSize, powerUpSize);
        ctx.shadowBlur = 0;
      } else if (powerUp.type === 'shield' && puShieldImageRef.current) {
        // Add glow effect
        ctx.shadowColor = '#0088ff';
        ctx.shadowBlur = isMobile() ? 15 : 20;
        ctx.drawImage(puShieldImageRef.current, powerUp.x, powerUp.y, powerUpSize, powerUpSize);
        ctx.shadowBlur = 0;
      }
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, currentDirection, keyboardDirection]);

  // Start game loop
  useEffect(() => {
    if (gameState.gameStarted && !gameState.gameOver && canvasRef.current) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.gameOver, gameLoop]);

  const handleJoystickMove = useCallback((direction: { x: 'left' | 'right' | 'center', y: 'up' | 'down' | 'center' }) => {
    setCurrentDirection(direction);
  }, []);

  const shoot = useCallback(() => {
    if (gameState.gameOver) return;
    setGameState(prev => {
      const newBullets = [...prev.bullets];
      
      if (prev.doubleShotActive) {
        // Double shot - shoot two bullets
        newBullets.push({
          x: prev.ship.x + prev.ship.width / 2 - 10,
          y: prev.ship.y,
          id: bulletIdRef.current++
        });
        newBullets.push({
          x: prev.ship.x + prev.ship.width / 2 + 10,
          y: prev.ship.y,
          id: bulletIdRef.current++
        });
      } else {
        // Normal shot - shoot one bullet
        newBullets.push({
          x: prev.ship.x + prev.ship.width / 2,
          y: prev.ship.y,
          id: bulletIdRef.current++
        });
      }
      
      return {
        ...prev,
        bullets: newBullets
      };
    });
  }, [gameState.gameOver]);

  // Start continuous shooting
  const startShooting = useCallback(() => {
    if (gameState.gameOver || isShooting) return;
    
    setIsShooting(true);
    // Shoot immediately when button is pressed
    shoot();
    
    // Then continue shooting every 150ms
    shootIntervalRef.current = setInterval(() => {
      shoot();
    }, 150);
  }, [gameState.gameOver, isShooting, shoot]);

  // Stop continuous shooting
  const stopShooting = useCallback(() => {
    setIsShooting(false);
    if (shootIntervalRef.current) {
      clearInterval(shootIntervalRef.current);
      shootIntervalRef.current = null;
    }
  }, []);

  // Handle continuous shooting
  useEffect(() => {
    return () => {
      if (shootIntervalRef.current) {
        clearInterval(shootIntervalRef.current);
      }
    };
  }, []);

  // Cleanup ad interval on unmount
  useEffect(() => {
    return () => {
      if (adIntervalRef.current) {
        clearInterval(adIntervalRef.current);
      }
    };
  }, []);



  // Add global event listeners for mouse/touch release
  useEffect(() => {
    const handleMouseUp = () => {
      stopShooting();
    };
    
    const handleTouchEnd = () => {
      stopShooting();
    };
    
    // Add keyboard support for desktop users
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!isShooting) {
          startShooting();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        stopShooting();
      }
    };
    
    if (isShooting) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }
    
    // Add keyboard listeners for all devices
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShooting, stopShooting, startShooting]);

  // Stop shooting when game is over
  useEffect(() => {
    if (gameState.gameOver) {
      stopShooting();
    }
  }, [gameState.gameOver, stopShooting]);

  // Prevent default touch behaviors
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchstart', preventScroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScroll, { passive: false } as EventListenerOptions);
      document.removeEventListener('touchstart', preventScroll, { passive: false } as EventListenerOptions);
    };
  }, []);

  const showInstructions = () => {
    setGameState(prev => ({
      ...prev,
      currentScreen: 'instructions',
      isStartAnimation: false
    }));
  };

  const startGame = () => {
    stopShooting();
    // Cancel any ongoing ad
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
      adIntervalRef.current = null;
    }
    setIsWatchingAd(false);
    setAdCountdown(0);
    setAdType('short');
    
    // Show rule reminder
    console.log('🎮 NEW RULE: Wrong catch = Go back 2 letters (not to start)');
    
    // Start the animation
    setGameState(prev => ({
      ...prev,
      isStartAnimation: true
    }));
    
    // Wait for animation to complete, then start the game
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        gameStarted: true,
        gameOver: false,
        currentScreen: 'game',
        score: 0,
        currentLetterIndex: 0,
        penalties: 0,
        bullets: [],
        letters: [],
        powerUps: [],
        selectedBackgroundIndex: Math.floor(Math.random() * BACKGROUND_IMAGES.length), // Select new random background
        isStartAnimation: false,
        doubleShotActive: false,
        doubleShotTimeLeft: 0,
        shieldActive: false,
        shieldTimeLeft: 0
      }));
    }, 1100); // Match the animation duration plus small buffer
  };

  // Expose game functions to console for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gameDebug = {
        startGame: () => startGame(),
        addLives: (lives: number) => {
          setGameState(prev => ({
            ...prev,
            penalties: Math.max(0, prev.penalties - lives)
          }));
        },
        addScore: (points: number) => {
          setGameState(prev => ({
            ...prev,
            score: prev.score + points
          }));
        },
        setLetter: (letterIndex: number) => {
          setGameState(prev => ({
            ...prev,
            currentLetterIndex: Math.max(0, Math.min(letterIndex, 25))
          }));
        },
        getGameState: () => gameState,
        showGameOver: () => {
          setGameState(prev => ({
            ...prev,
            gameOver: true
          }));
        },
        reviveGame: () => {
          setGameState(prev => ({
            ...prev,
            gameOver: false,
            penalties: 0
          }));
        },
        help: () => {
          console.log('🎮 ABC Jet Game - Help');
          console.log('Available commands:');
          console.log('  startGame() - Start new game');
          console.log('  addLives(n) - Add lives (negative removes lives)');
          console.log('  addScore(n) - Add score points');
          console.log('  setLetter(n) - Set current letter (0=A, 1=B, ..., 25=Z)');
          console.log('  getGameState() - Get current game state');
          console.log('  showGameOver() - Force game over');
          console.log('  reviveGame() - Revive from game over');
          console.log('  testWrongCatch() - Test the new wrong catch rule');
          console.log('  fixButtons() - Fix buttons for console compatibility');
          console.log('  help() - Show this help');
        },
        fixButtons: () => {
          const buttons = document.querySelectorAll('button');
          buttons.forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.zIndex = '9999';
          });
          console.log('🔧 Fixed all buttons for console compatibility');
        },
        testWrongCatch: () => {
          const currentLetter = gameState.currentLetterIndex;
          const currentLetterName = alphabet[currentLetter];
          const afterPenalty = Math.max(0, currentLetter - 2);
          const afterPenaltyName = alphabet[afterPenalty];
          
          console.log(`🧪 Testing wrong catch rule:`);
          console.log(`Current letter: ${currentLetterName} (index ${currentLetter})`);
          console.log(`After wrong catch: ${afterPenaltyName} (index ${afterPenalty})`);
          console.log(`Goes back ${currentLetter - afterPenalty} letters`);
          
          // Show examples
          console.log(`\n📋 Examples:`);
          console.log(`At F (5) → Wrong catch → Go to D (3) - Goes back 2`);
          console.log(`At C (2) → Wrong catch → Go to A (0) - Goes back 2`);
          console.log(`At B (1) → Wrong catch → Stay at A (0) - Minimum is A`);
          console.log(`At A (0) → Wrong catch → Stay at A (0) - Minimum is A`);
          
          return {
            current: { letter: currentLetterName, index: currentLetter },
            after: { letter: afterPenaltyName, index: afterPenalty },
            goesBack: currentLetter - afterPenalty
          };
        }
      };
      
      // Log debug info
      console.log('🎮 ABC Jet Game Debug Console Ready!');
      console.log('💡 TIP: Click the page first if buttons don\'t work with console open');
      console.log('Available commands:');
      console.log('  window.gameDebug.startGame() - Start new game');
      console.log('  window.gameDebug.addLives(n) - Add lives');
      console.log('  window.gameDebug.addScore(n) - Add score');
      console.log('  window.gameDebug.setLetter(n) - Set current letter (0-25)');
      console.log('  window.gameDebug.getGameState() - Get current game state');
      console.log('  window.gameDebug.showGameOver() - Show game over');
      console.log('  window.gameDebug.reviveGame() - Revive from game over');
      console.log('  window.gameDebug.testWrongCatch() - Test new wrong catch rule');
      console.log('  window.gameDebug.help() - Show detailed help');
      console.log('  window.gameDebug.fixButtons() - Fix buttons if not working');
      console.log('📱 Mobile users: Close console for better performance');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.gameDebug;
      }
    };
  }, [gameState, startGame]);

  // Fix for console focus issues
  useEffect(() => {
    const handleFocus = () => {
      // Force refocus on the game when console is closed
      if (document.body) {
        document.body.focus();
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refocus
        setTimeout(() => {
          if (document.body) {
            document.body.focus();
          }
        }, 100);
      }
    };

    // Ensure buttons work even when console is open
    const ensureButtonsWork = () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.zIndex = '9999';
      });
      console.log('🎮 Buttons fixed for console compatibility');
    };

    // Run immediately and periodically
    ensureButtonsWork();
    const buttonInterval = setInterval(ensureButtonsWork, 1000);

    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const focusedButton = document.activeElement as HTMLButtonElement;
        if (focusedButton && focusedButton.tagName === 'BUTTON') {
          e.preventDefault();
          focusedButton.click();
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(buttonInterval);
    };
  }, []);

  const backToStart = () => {
    stopShooting();
    // Cancel any ongoing ad
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
      adIntervalRef.current = null;
    }
    setIsWatchingAd(false);
    setAdCountdown(0);
    setAdType('short');
    setGameState(prev => ({
      ...prev,
      currentScreen: 'start',
      gameStarted: false,
      gameOver: false,
      isStartAnimation: false
    }));
  };

  const backToInstructions = () => {
    stopShooting();
    // Cancel any ongoing ad
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
      adIntervalRef.current = null;
    }
    setIsWatchingAd(false);
    setAdCountdown(0);
    setAdType('short');
    setGameState(prev => ({
      ...prev,
      currentScreen: 'instructions',
      gameStarted: false,
      gameOver: false,
      isStartAnimation: false
    }));
  };

  // Start Screen
  if (gameState.currentScreen === 'start') {
    return (
      <div className="game-container flex flex-col items-center justify-center">
        <div className="text-center space-y-8">
          <div className={`flex items-center justify-center ${isMobile() ? 'space-x-4' : 'space-x-6'}`}>
            <img 
              src={spaceshipImg} 
              alt="Spaceship" 
              className={`object-contain ${gameState.isStartAnimation ? 'spaceship-animation' : ''} ${isMobile() ? 'w-16 h-16' : 'w-20 h-20'}`}
              style={{
                filter: gameState.isStartAnimation ? '' : 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))'
              }}
            />
            <h1 className={`neon-title ${gameState.isStartAnimation ? 'title-fade-out' : ''} ${isMobile() ? 'text-3xl' : 'text-6xl'}`}>ABC JET</h1>
            <img 
              src={spaceshipImg} 
              alt="Spaceship" 
              className={`object-contain ${gameState.isStartAnimation ? 'spaceship-animation-left' : ''} ${isMobile() ? 'w-16 h-16' : 'w-20 h-20'}`}
              style={{
                filter: gameState.isStartAnimation ? '' : 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
                transform: gameState.isStartAnimation ? '' : 'scaleX(-1)'
              }}
            />
          </div>
          <p className={`neon-text ${gameState.isStartAnimation ? 'title-fade-out' : ''} ${isMobile() ? 'text-base px-4' : 'text-2xl'}`}>Welcome to the ultimate alphabet challenge!</p>
          <div className={`flex justify-center mt-8 ${gameState.isStartAnimation ? 'title-fade-out' : ''} ${isMobile() ? 'flex-col space-y-4 px-4' : 'space-x-6'}`}>
            <button
              onClick={startGame}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`mobile-btn control-btn ${isMobile() ? 'w-full h-12 text-sm' : 'w-40 h-16 text-xl'}`}
              style={{
                color: gameState.isStartAnimation ? '#666' : '#ff0000',
                textShadow: gameState.isStartAnimation ? '0 0 5px #666' : '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000',
                fontWeight: 'bold',
                touchAction: 'manipulation',
                opacity: gameState.isStartAnimation ? 0.5 : 1,
                cursor: gameState.isStartAnimation ? 'not-allowed' : 'pointer',
                pointerEvents: 'auto'
              }}
              disabled={gameState.isStartAnimation}
            >
              {gameState.isStartAnimation ? 'LAUNCHING...' : 'START GAME'}
            </button>
            <button
              onClick={showInstructions}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`mobile-btn control-btn neon-text ${isMobile() ? 'w-full h-12 text-sm' : 'w-40 h-16 text-xl'}`}
              style={{
                touchAction: 'manipulation',
                pointerEvents: 'auto'
              }}
              disabled={gameState.isStartAnimation}
            >
              HOW TO PLAY
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Instructions Screen
  if (gameState.currentScreen === 'instructions') {
    return (
      <div className="game-container flex flex-col items-center justify-center">
        <div className={`text-center space-y-4 ${isMobile() ? 'max-w-sm px-4' : 'max-w-2xl'}`}>
          <h1 className={`neon-title mb-4 ${isMobile() ? 'text-3xl' : 'text-5xl'}`}>HOW TO PLAY</h1>
          <div className={`neon-text space-y-3 ${isMobile() ? 'text-sm' : 'text-lg'}`}>
            <div className={`bg-black/50 rounded-lg border border-cyan-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>🎯 <strong>CATCH</strong> letters in ABC order</p>
              <p className={`text-cyan-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>Touch the correct letter with your spaceship = 2 points</p>
            </div>
            <div className={`bg-black/50 rounded-lg border border-cyan-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>🔫 <strong>SHOOT</strong> other letters</p>
              <p className={`text-cyan-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>Shoot letters that are NOT in order = 1 point</p>
            </div>
            <div className={`bg-black/50 rounded-lg border border-cyan-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>🎁 <strong>POWER-UPS</strong> give special abilities</p>
              <p className={`text-cyan-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>🎯 X2 = Double shooting | ❤️ = Extra life | 🛡️ = Shield protection</p>
            </div>
            <div className={`bg-black/50 rounded-lg border border-red-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>❌ <strong>WRONG CATCH</strong> = Lose Life!</p>
              <p className={`text-red-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>Catch wrong letter = Lose life + go back 2 letters</p>
              <p className={`text-red-200 mt-1 ${isMobile() ? 'text-xs' : 'text-xs'}`}>Example: At F? Wrong catch → Go back to D</p>
              <p className={`text-red-200 ${isMobile() ? 'text-xs' : 'text-xs'}`}>At A or B? Wrong catch → Stay at A (minimum)</p>
            </div>
            <div className={`bg-black/50 rounded-lg border border-red-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>💀 <strong>NO LIVES LEFT</strong> = Game Over</p>
              <p className={`text-red-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>Be careful! You have {MAX_STRIKES} lives total</p>
            </div>
            <div className={`bg-black/50 rounded-lg border border-purple-500 ${isMobile() ? 'p-3' : 'p-4'}`}>
              <p className={`mb-2 ${isMobile() ? 'text-base' : 'text-2xl'}`}>🎮 <strong>CONTROLS</strong></p>
              {isMobile() ? (
                <div className={`text-purple-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>
                  <p>🕹️ <strong>Joystick</strong> = Move spaceship</p>
                  <p>🔴 <strong>Shoot Button</strong> = Fire bullets</p>
                  <p className="text-purple-200 mt-1">Hold shoot button for continuous firing!</p>
                </div>
              ) : (
                <div className={`text-purple-300 ${isMobile() ? 'text-xs' : 'text-sm'}`}>
                  <p>🕹️ <strong>Joystick</strong> or <strong>WASD/Arrow Keys</strong> = Move</p>
                  <p>🔴 <strong>Shoot Button</strong> or <strong>Spacebar</strong> = Fire</p>
                  <p className="text-purple-200 mt-1">Hold controls for continuous action!</p>
                </div>
              )}
            </div>
          </div>
          <div className={`flex mt-6 ${isMobile() ? 'flex-col space-y-3' : 'space-x-4'}`}>
            <button
              onClick={backToStart}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`control-btn neon-text flex items-center justify-center ${isMobile() ? 'w-full h-12 text-base' : 'w-32 h-16 text-xl'}`}
              style={{ pointerEvents: 'auto' }}
            >
              <ArrowLeft className={`${isMobile() ? 'w-4 h-4' : 'w-6 h-6'} mr-2`} />
              BACK
            </button>
            <button
              onClick={startGame}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`control-btn neon-text ${isMobile() ? 'w-full h-12 text-base' : 'w-32 h-16 text-xl'}`}
              style={{ pointerEvents: 'auto' }}
            >
              START
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Over overlay functions
  const watchShortAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(5);
    setAdType('short');
    
    // Clear any existing interval
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
    }
    
    // Show countdown
    adIntervalRef.current = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(adIntervalRef.current!);
          adIntervalRef.current = null;
          setIsWatchingAd(false);
          // Show completion message
          alert("פרסומת הושלמה! חוזר למשחק עם חיים נוספים! 🎉");
          // Continue game with current score but with 1 life restored
          // Note: currentLetterIndex and score are preserved from previous state
          setGameState(prev => ({
            ...prev,
            penalties: MAX_STRIKES - 1, // Give player 1 life
            gameOver: false
          }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const watchLongAd = () => {
    setIsWatchingAd(true);
    setAdCountdown(15);
    setAdType('long');
    
    // Clear any existing interval
    if (adIntervalRef.current) {
      clearInterval(adIntervalRef.current);
    }
    
    // Show countdown
    adIntervalRef.current = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(adIntervalRef.current!);
          adIntervalRef.current = null;
          setIsWatchingAd(false);
          // Show completion message
          alert("פרסומת הושלמה! חוזר למשחק עם 3 חיים נוספים! 🎉🎉🎉");
          // Continue game with current score but with 3 lives restored
          // Note: currentLetterIndex and score are preserved from previous state
          setGameState(prev => ({
            ...prev,
            penalties: Math.max(0, MAX_STRIKES - 3), // Give player 3 lives (or reset to 0 if more than 3)
            gameOver: false
          }));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Game Over Screen
  if (gameState.currentScreen === 'gameOver') {
    return (
      <div className="game-container flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className={`neon-title mb-4 text-red-500 ${isMobile() ? 'text-4xl' : 'text-6xl'}`}>GAME OVER</h1>
          <p className={`neon-text ${isMobile() ? 'text-lg' : 'text-2xl'}`}>Score: {gameState.score}</p>
          <p className={`neon-text text-red-400 ${isMobile() ? 'text-base' : 'text-xl'}`}>No Lives Left - Game Over!</p>
          <div className="flex space-x-4">
            <button
              onClick={backToInstructions}
              className="control-btn w-32 h-16 text-xl neon-text flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              BACK
            </button>
            <button
              onClick={startGame}
              className="control-btn w-32 h-16 text-xl neon-text"
            >
              RESTART
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={gameState.gameWidth}
        height={gameState.gameHeight}
        className="game-canvas"
        style={{
          filter: gameState.gameOver ? 'blur(3px)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
      
      {/* UI Overlay - Mobile Optimized */}
      <div className="game-ui z-40" style={{
        filter: gameState.gameOver ? 'blur(2px)' : 'none',
        opacity: gameState.gameOver ? 0.5 : 1,
        transition: 'filter 0.3s ease, opacity 0.3s ease'
      }}>
        {/* Back Button - Top Left */}
        <div className={`absolute ${isMobile() ? 'top-2 left-2' : 'top-4 left-4'} z-50 pointer-events-auto`}>
          <button
            onClick={backToInstructions}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className={`mobile-btn bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/70 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400 transition-all duration-200 flex items-center space-x-2 ${isMobile() ? 'px-3 py-2' : 'px-4 py-2'}`}
            style={{
              textShadow: '0 0 5px rgba(0, 255, 255, 0.5)',
              touchAction: 'manipulation',
              boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
              pointerEvents: 'auto'
            }}
          >
            <ArrowLeft className={`${isMobile() ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span className={`font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Back</span>
          </button>
        </div>
        
        {/* Game Stats - Under Back Button */}
        <div className={`absolute ${isMobile() ? 'top-12 left-2' : 'top-16 left-4'} z-50 pointer-events-auto`}>
          <div className={`mobile-ui-panel bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/70 ${isMobile() ? 'p-2 min-w-[150px]' : 'p-3 min-w-[200px]'}`} style={{
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
          }}>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={`text-cyan-300 font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Score</span>
                <span className={`text-white font-bold ${isMobile() ? 'text-lg' : 'text-xl'}`} style={{
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
                }}>{gameState.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-green-300 font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Target</span>
                <span className={`text-yellow-400 font-bold ${isMobile() ? 'text-lg' : 'text-xl'}`} style={{
                  textShadow: '0 0 10px rgba(255, 255, 0, 0.8)'
                }}>{alphabet[gameState.currentLetterIndex]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-green-300 font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Lives</span>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: MAX_STRIKES }, (_, index) => (
                    <img 
                      key={index}
                      src={shootBulletImg} 
                      alt="Life" 
                      className={`object-contain ${isMobile() ? 'w-5 h-5' : 'w-6 h-6'}`}
                      style={{
                        filter: index < (MAX_STRIKES - gameState.penalties)
                          ? 'drop-shadow(0 0 12px rgba(0, 255, 0, 1)) drop-shadow(0 0 20px rgba(0, 255, 0, 0.8)) brightness(1.8) saturate(1.8) contrast(1.3)'
                          : 'drop-shadow(0 0 2px rgba(80, 80, 80, 0.3)) brightness(0.2) saturate(0.2) contrast(0.5)',
                        transition: 'all 0.4s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Double Shot Indicator */}
              {gameState.doubleShotActive && (
                <div className="flex justify-between items-center">
                  <span className={`text-orange-300 font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Double Shot</span>
                  <div className="flex items-center">
                    <span className={`text-orange-400 font-bold ${isMobile() ? 'text-sm' : 'text-base'}`} style={{
                      textShadow: '0 0 10px rgba(255, 136, 0, 0.8)'
                    }}>X2 {Math.ceil(gameState.doubleShotTimeLeft / 1000)}s</span>
                  </div>
                </div>
              )}
              {/* Shield Indicator */}
              {gameState.shieldActive && (
                <div className="flex justify-between items-center">
                  <span className={`text-blue-300 font-medium uppercase tracking-wide ${isMobile() ? 'text-xs' : 'text-sm'}`}>Shield</span>
                  <div className="flex items-center">
                                         <span className={`text-blue-400 font-bold ${isMobile() ? 'text-sm' : 'text-base'}`} style={{
                       textShadow: '0 0 10px rgba(0, 136, 255, 0.8)'
                     }}>🛡️ {Math.ceil(gameState.shieldTimeLeft / 1000)}s</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls - Mobile Optimized */}
      <div className="game-controls z-30" style={{
        filter: gameState.gameOver ? 'blur(2px)' : 'none',
        opacity: gameState.gameOver ? 0.3 : 1,
        pointerEvents: gameState.gameOver ? 'none' : 'auto',
        transition: 'filter 0.3s ease, opacity 0.3s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <Joystick onMove={handleJoystickMove} size={shouldShowJoystick() ? (isMobile() ? 100 : 120) : 120} />
        
        <button
          className="relative rounded-full mobile-shoot-btn"
          onTouchStart={startShooting}
          onMouseDown={startShooting}
          style={{
            width: isMobile() ? '50px' : '60px',
            height: isMobile() ? '50px' : '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle, rgba(255, 80, 0, 0.9) 0%, rgba(220, 60, 0, 0.8) 50%, rgba(180, 40, 0, 0.7) 100%)',
            border: isMobile() ? '1px solid rgba(255, 120, 0, 1)' : '2px solid rgba(255, 120, 0, 1)',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: isMobile() 
              ? '0 0 20px rgba(255, 80, 0, 1), 0 0 40px rgba(220, 60, 0, 1), 0 0 60px rgba(255, 40, 0, 0.6), inset 0 0 12px rgba(255, 150, 0, 0.8)'
              : '0 0 25px rgba(255, 80, 0, 1), 0 0 50px rgba(220, 60, 0, 1), 0 0 75px rgba(255, 40, 0, 0.6), inset 0 0 15px rgba(255, 150, 0, 0.8)',
            transition: 'all 0.1s ease',
            animation: 'shoot-button-pulse 1.5s ease-in-out infinite',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 35px rgba(255, 120, 0, 1), 0 0 70px rgba(255, 80, 0, 1), 0 0 100px rgba(220, 60, 0, 0.8), inset 0 0 20px rgba(255, 180, 0, 0.9)';
            e.currentTarget.style.transform = 'scale(1.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 25px rgba(255, 80, 0, 1), 0 0 50px rgba(220, 60, 0, 1), 0 0 75px rgba(255, 40, 0, 0.6), inset 0 0 15px rgba(255, 150, 0, 0.8)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <img 
            src={shootButtonImg} 
            alt="Shoot" 
            className={`object-contain ${isMobile() ? 'w-8 h-8' : 'w-10 h-10'}`}
            style={{
              filter: isMobile() 
                ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 1)) drop-shadow(0 0 15px rgba(255, 120, 0, 1)) drop-shadow(0 0 20px rgba(220, 60, 0, 0.8)) brightness(1.5) contrast(1.6) saturate(1.3)'
                : 'drop-shadow(0 0 10px rgba(255, 255, 255, 1)) drop-shadow(0 0 18px rgba(255, 120, 0, 1)) drop-shadow(0 0 25px rgba(220, 60, 0, 0.8)) brightness(1.5) contrast(1.6) saturate(1.3)',
              transition: 'transform 0.1s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.9)';
              e.currentTarget.parentElement.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.parentElement.style.transform = 'scale(1.15)';
            }}
          />
          
          {/* Outer pulsing ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(255, 120, 0, 0.9)',
              transform: 'scale(1.3)',
              animation: 'shoot-ring-pulse 2s ease-in-out infinite'
            }}
          />
          
          {/* Inner rotating ring */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255, 150, 0, 0.7)',
              borderTopColor: 'rgba(255, 220, 0, 1)',
              borderRightColor: 'rgba(255, 180, 0, 0.9)',
              transform: 'scale(1.15)',
              animation: 'shoot-ring-spin 3s linear infinite'
            }}
          />
          
          {/* Shooting sparks animation */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 120, 0, 0.4) 0%, rgba(255, 80, 0, 0.2) 50%, transparent 70%)',
              animation: 'shoot-sparks 1s ease-in-out infinite alternate'
            }}
          />
          
          {/* Extra glow layer */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(255, 200, 0, 0.6)',
              transform: 'scale(1.5)',
              animation: 'shoot-ring-pulse 2.5s ease-in-out infinite reverse'
            }}
          />
        </button>
      </div>

      {/* Game Over Overlay */}
      {gameState.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center z-50" style={{
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" style={{
            background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.8) 100%)'
          }}></div>
          
                     {/* Ad Screen Overlay */}
           {isWatchingAd && (
             <div className={`relative z-60 text-center ${isMobile() ? 'max-w-xs mx-auto px-3' : 'max-w-md mx-auto px-4'}`} style={{
               animation: 'slideInDown 0.6s ease-out'
             }}>
               <div className={`bg-black/90 backdrop-blur-md rounded-2xl border-2 border-yellow-500/70 shadow-2xl ${isMobile() ? 'p-4' : 'p-6'}`}
                 style={{
                   boxShadow: '0 0 40px rgba(255, 255, 0, 0.5), inset 0 0 40px rgba(255, 255, 0, 0.2), 0 0 80px rgba(255, 255, 0, 0.3)'
                 }}
               >
                 <h1 className={`neon-title mb-4 text-yellow-500 ${isMobile() ? 'text-xl' : 'text-2xl'}`}>WATCHING AD</h1>
                 <div className={`${isMobile() ? 'text-5xl' : 'text-6xl'} mb-4`}>📺</div>
                 <p className={`text-yellow-300 mb-4 ${isMobile() ? 'text-sm' : 'text-base'}`}>Advertisement Playing...</p>
                 <div className={`text-white font-bold ${isMobile() ? 'text-3xl' : 'text-4xl'}`}>{adCountdown}</div>
                 <p className={`text-yellow-400 mt-2 ${isMobile() ? 'text-xs' : 'text-xs'}`}>seconds remaining</p>
                 <div className={`mt-4 p-3 bg-green-900/50 rounded-lg border border-green-500/50`}>
                   <p className={`text-green-300 ${isMobile() ? 'text-xs' : 'text-xs'}`}>
                     {adType === 'short' ? '🎁 You will continue with 1 life!' : '🎁 You will continue with 3 lives!'}
                   </p>
                 </div>
                 <div className={`${isMobile() ? 'mt-4' : 'mt-4'}`}>
                   <button
                     onClick={() => {
                       // Cancel the ad interval
                       if (adIntervalRef.current) {
                         clearInterval(adIntervalRef.current);
                         adIntervalRef.current = null;
                       }
                       setIsWatchingAd(false);
                       setAdCountdown(0);
                       setAdType('short');
                     }}
                     onMouseDown={(e) => e.stopPropagation()}
                     onTouchStart={(e) => e.stopPropagation()}
                     className={`mobile-btn control-btn neon-text bg-red-900/50 hover:bg-red-800/70 border-red-500 ${isMobile() ? 'h-8 text-xs px-3' : 'h-8 text-xs px-4'}`}
                     style={{ pointerEvents: 'auto' }}
                   >
                     ❌ Cancel Ad
                   </button>
                 </div>
               </div>
             </div>
           )}

                                {/* Game Over Screen Overlay */}
           {!isWatchingAd && (
             <div className={`relative z-60 text-center ${isMobile() ? 'max-w-xs mx-auto px-3' : 'max-w-md mx-auto px-4'}`} style={{
               animation: 'slideInDown 0.6s ease-out'
             }}>
               <div className={`bg-black/90 backdrop-blur-md rounded-2xl border-2 border-red-500/70 shadow-2xl ${isMobile() ? 'p-3' : 'p-4'}`}
                 style={{
                   boxShadow: '0 0 40px rgba(255, 0, 0, 0.5), inset 0 0 40px rgba(255, 0, 0, 0.2), 0 0 80px rgba(255, 0, 0, 0.3)'
                 }}
               >
                 <h1 className={`neon-title mb-4 text-red-500 ${isMobile() ? 'text-xl' : 'text-2xl'}`}>GAME OVER</h1>
                 <p className={`neon-text mb-2 ${isMobile() ? 'text-sm' : 'text-base'}`}>Score: {gameState.score}</p>
                 <p className={`neon-text text-red-400 mb-4 ${isMobile() ? 'text-xs' : 'text-sm'}`}>No Lives Left!</p>
                 
                 <div className={`${isMobile() ? 'space-y-2' : 'space-y-3'}`}>
                   <div className={`bg-cyan-900/30 rounded-lg border border-cyan-500/50 ${isMobile() ? 'p-2' : 'p-3'}`}>
                     <p className={`text-cyan-300 mb-2 ${isMobile() ? 'text-xs' : 'text-xs'}`}>Choose your option:</p>
                     <div className={`bg-blue-900/30 rounded border border-blue-500/30 mb-3 ${isMobile() ? 'p-2' : 'p-2'}`}>
                       <p className={`text-blue-300 ${isMobile() ? 'text-xs mb-1' : 'text-xs mb-1'}`}>
                         💡 Watch ads to continue playing!
                       </p>
                       <p className={`text-blue-200 ${isMobile() ? 'text-xs mb-1' : 'text-xs mb-1'}`}>
                         📊 Score: {gameState.score} | 🎯 Target: {alphabet[gameState.currentLetterIndex]}
                       </p>
                       <p className={`text-green-300 ${isMobile() ? 'text-xs' : 'text-xs'}`}>
                         🎮 Continue current game with extra lives!
                       </p>
                     </div>
                     <div className={`${isMobile() ? 'space-y-2' : 'space-y-2'}`}>
                       <button
                         onClick={startGame}
                         onMouseDown={(e) => e.stopPropagation()}
                         onTouchStart={(e) => e.stopPropagation()}
                         className={`w-full mobile-btn control-btn neon-text bg-blue-900/50 hover:bg-blue-800/70 border-blue-500 ${isMobile() ? 'h-10 text-xs' : 'h-12 text-sm'} px-3`}
                         style={{ pointerEvents: 'auto' }}
                       >
                         🔄 Start Over
                       </button>
                       <button
                         onClick={watchShortAd}
                         onMouseDown={(e) => e.stopPropagation()}
                         onTouchStart={(e) => e.stopPropagation()}
                         className={`w-full mobile-btn control-btn neon-text bg-green-900/50 hover:bg-green-800/70 border-green-500 ${isMobile() ? 'h-10 text-xs' : 'h-12 text-sm'} px-3`}
                         style={{ pointerEvents: 'auto' }}
                       >
                         📺 Continue Game with 1 Life
                       </button>
                       <button
                         onClick={watchLongAd}
                         onMouseDown={(e) => e.stopPropagation()}
                         onTouchStart={(e) => e.stopPropagation()}
                         className={`w-full mobile-btn control-btn neon-text bg-yellow-900/50 hover:bg-yellow-800/70 border-yellow-500 ${isMobile() ? 'h-10 text-xs' : 'h-12 text-sm'} px-3`}
                         style={{ pointerEvents: 'auto' }}
                       >
                         📺 Continue Game with 3 Lives
                       </button>
                     </div>
                   </div>
                 </div>
                 
                 <div className={`flex justify-center ${isMobile() ? 'mt-3' : 'mt-4'}`}>
                   <button
                     onClick={backToInstructions}
                     onMouseDown={(e) => e.stopPropagation()}
                     onTouchStart={(e) => e.stopPropagation()}
                     className={`mobile-btn control-btn neon-text flex items-center justify-center ${isMobile() ? 'px-3 h-8 text-xs' : 'px-4 h-8 text-xs'}`}
                     style={{ pointerEvents: 'auto' }}
                   >
                     <ArrowLeft className={`${isMobile() ? 'w-3 h-3' : 'w-3 h-3'} mr-1`} />
                     BACK
                   </button>
                 </div>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ABCJetGame;