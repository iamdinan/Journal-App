import React, { createContext, useContext, useState, useEffect } from 'react';

interface WallpaperContextType {
  wallpaperEnabled: boolean;
  toggleWallpaper: () => void;
  currentWallpaper: string;
  refreshWallpaper: () => void;
}

const WallpaperContext = createContext<WallpaperContextType | undefined>(undefined);

// Nature wallpaper URLs from Unsplash
const wallpapers = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', // Mountains
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80', // Nature sunset
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', // Ocean waves
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', // Foggy mountains
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', // Forest sunlight
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80', // Lake reflection
  'https://images.unsplash.com/photo-1505144808419-1957a94ca61e?w=1920&q=80', // Beach sunset
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', // Starry mountains
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80', // Snow peaks
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80', // Green valley
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', // Meadow hills
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1920&q=80', // Desert dunes
];

const getRandomWallpaper = () => {
  return wallpapers[Math.floor(Math.random() * wallpapers.length)];
};

export const WallpaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallpaperEnabled, setWallpaperEnabled] = useState(() => {
    const saved = localStorage.getItem('wallpaper-enabled');
    return saved === 'true';
  });
  
  const [currentWallpaper, setCurrentWallpaper] = useState(() => getRandomWallpaper());

  useEffect(() => {
    localStorage.setItem('wallpaper-enabled', String(wallpaperEnabled));
  }, [wallpaperEnabled]);

  const toggleWallpaper = () => {
    setWallpaperEnabled(prev => !prev);
  };

  const refreshWallpaper = () => {
    setCurrentWallpaper(getRandomWallpaper());
  };

  return (
    <WallpaperContext.Provider value={{ wallpaperEnabled, toggleWallpaper, currentWallpaper, refreshWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
};

export const useWallpaper = () => {
  const context = useContext(WallpaperContext);
  if (!context) {
    throw new Error('useWallpaper must be used within a WallpaperProvider');
  }
  return context;
};
