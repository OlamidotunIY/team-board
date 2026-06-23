import { GalleryVerticalEnd } from "lucide-react";

const ScreenLoader = () =>
{
  return (
    <div className="flex flex-col items-center gap-6 justify-center fixed inset-0 z-50 bg-background transition-opacity duration-700 ease-in-out">
      <a href="#" className="flex items-center gap-2 font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Team Board.
      </a>
      <div className="flex flex-col items-center gap-3">
        <div className="text-muted-foreground font-medium text-lg">Loading...</div>
        <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export { ScreenLoader };
