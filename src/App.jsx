import React, { useEffect } from 'react';
    import { Toaster } from '@/components/ui/toaster';
    import ColorPaletteApp from '@/components/ColorPaletteApp';

    function App() {
      useEffect(() => {
        const removeExistingFontLinks = () => {
          const links = document.head.querySelectorAll('link[href^="https://fonts.googleapis.com/css2?family="]');
          links.forEach(link => link.remove());
        };
        removeExistingFontLinks();
      }, []);

      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start p-4 transition-colors duration-300">
          <ColorPaletteApp />
          <Toaster />
        </div>
      );
    }

    export default App;