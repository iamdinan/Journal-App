import { Image, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallpaper } from '@/context/WallpaperContext';

const WallpaperToggle = () => {
  const { wallpaperEnabled, toggleWallpaper } = useWallpaper();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleWallpaper}
      className="text-muted-foreground hover:text-foreground"
      title={wallpaperEnabled ? 'Disable wallpaper' : 'Enable wallpaper'}
    >
      {wallpaperEnabled ? (
        <Image className="h-5 w-5" />
      ) : (
        <ImageOff className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle wallpaper</span>
    </Button>
  );
};

export default WallpaperToggle;
