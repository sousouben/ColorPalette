export const extractColorsFromImage = async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            setTimeout(() => {
              resolve(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA', '#F0F2A6']);
            }, 1000);
          };
          reader.readAsDataURL(file);
        });
      };
      
      export const keywordPalettes = {
        "énergie": ["#FF6B6B", "#FFA500", "#FFFF00", "#FF4500", "#FFD700"],
        "vintage": ["#D4A373", "#FAEDCD", "#CCD5AE", "#E9EDC9", "#FEFAE0"],
        "zen": ["#A3B18A", "#DAD7CD", "#588157", "#3A5A40", "#344E41"],
        "chaud": ["#FF7B00", "#FF8800", "#FF9500", "#FFA200", "#FFAA00"],
        "cyberpunk": ["#00FFFF", "#FF00FF", "#FFFF00", "#00FF00", "#FF0000"],
        "océan": ["#0077B6", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF"],
        "forêt": ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
        "désert": ["#F4A261", "#E76F51", "#2A9D8F", "#264653", "#E9C46A"],
      };
      
      export const generatePaletteFromKeyword = (keyword) => {
        const lowerKeyword = keyword.toLowerCase();
        if (keywordPalettes[lowerKeyword]) {
          return keywordPalettes[lowerKeyword];
        }
        const randomPalette = [];
        for (let i = 0; i < 5; i++) {
          randomPalette.push(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
        }
        return randomPalette;
      };
      
      export const filterColors = (colors, avoidNeutrals = false) => {
        if (!avoidNeutrals) return colors;
        const neutralThreshold = 20;
        return colors.filter(color => {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          return (max - min) > neutralThreshold;
        });
      };
      
      export const chroma = (hex) => {
        if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) {
            return { luminance: () => 0.5 }; 
        }
        try {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return { luminance: () => lum };
        } catch (e) {
            console.error("Error calculating luminance for color:", hex, e);
            return { luminance: () => 0.5 }; 
        }
      };
    
      export const googleFonts = [
        { value: 'Roboto', label: 'Roboto' },
        { value: 'Open Sans', label: 'Open Sans' },
        { value: 'Lato', label: 'Lato' },
        { value: 'Montserrat', label: 'Montserrat' },
        { value: 'Oswald', label: 'Oswald' },
        { value: 'Source Sans Pro', label: 'Source Sans Pro' },
        { value: 'Raleway', label: 'Raleway' },
        { value: 'PT Sans', label: 'PT Sans' },
        { value: 'Merriweather', label: 'Merriweather' },
        { value: 'Nunito', label: 'Nunito' },
      ];
    
      export const getFontLink = (fontFamily) => {
        if (!fontFamily) return '';
        const fontQuery = fontFamily.replace(/ /g, '+');
        return `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@400;700&display=swap`;
      };

      export const simulateColorBlindness = (hexColor, type) => {
        return hexColor; 
      };

      const getContrastColor = (hexColor) => {
        if (!hexColor) return '#000000';
        const lum = chroma(hexColor).luminance();
        return lum > 0.5 ? '#000000' : '#FFFFFF';
      };

      export const generatePreviewCss = (palette, selectedFont, theme, previewColor) => {
        if (!palette || palette.length === 0) return '';

        const currentPreviewColor = previewColor || palette[0];
        const simulatedPalette = palette.map(color => simulateColorBlindness(color, 'none'));
        const simulatedPreviewColor = simulateColorBlindness(currentPreviewColor, 'none');
      
        const primaryColor = simulatedPalette[0] || simulatedPreviewColor;
        const secondaryColor = simulatedPalette[1] || (theme === 'dark' ? '#E2E8F0' : '#1E293B');
        const accentColor = simulatedPalette[2] || '#888888';
        const backgroundColor = theme === 'dark' ? simulateColorBlindness('#1E293B', 'none') : simulateColorBlindness('#F8FAFC', 'none');
        const cardBgColor = theme === 'dark' ? simulateColorBlindness('#2C3E50', 'none') : simulateColorBlindness('#FFFFFF', 'none');
        
        const textOnPrimary = getContrastColor(primaryColor);
        const textOnSecondary = getContrastColor(secondaryColor);
        const textOnBackground = getContrastColor(backgroundColor);
        const textOnCard = getContrastColor(cardBgColor);

        let css = `/* Palette Variables */\n:root {\n`;
        simulatedPalette.forEach((color, index) => {
          css += `  --palette-color-${index + 1}: ${color};\n`;
        });
        css += `
  --preview-primary: ${primaryColor};
  --preview-secondary: ${secondaryColor};
  --preview-accent: ${accentColor};
  --preview-background: ${backgroundColor};
  --preview-card-bg: ${cardBgColor};
  --preview-text-on-primary: ${textOnPrimary};
  --preview-text-on-secondary: ${textOnSecondary};
  --preview-text-on-background: ${textOnBackground};
  --preview-text-on-card: ${textOnCard};
`;
        if (selectedFont && selectedFont.value) {
          css += `  --preview-font-family: '${selectedFont.value}', sans-serif;\n`;
        }
        css += `}\n\n`;

        if (selectedFont && selectedFont.value) {
          css += `@import url('${getFontLink(selectedFont.value)}');\n\n`;
        }

        css += `body {\n`;
        if (selectedFont && selectedFont.value) {
          css += `  font-family: var(--preview-font-family);\n`;
        }
        css += `  background-color: var(--preview-background);\n`;
        css += `  color: var(--preview-text-on-background);\n`;
        css += `}\n\n`;

        css += `.preview-hero {\n`;
        css += `  background-color: var(--preview-primary);\n`;
        css += `  color: var(--preview-text-on-primary);\n`;
        css += `  padding: 2rem;\n`;
        css += `  text-align: center;\n`;
        css += `}\n\n`;
        
        css += `.preview-hero h1 {\n`;
        css += `  font-size: 2.5rem;\n`;
        css += `  font-weight: bold;\n`;
        css += `}\n\n`;

        css += `.preview-hero p {\n`;
        css += `  font-size: 1.125rem;\n`;
        css += `  margin-top: 0.5rem;\n`;
        css += `}\n\n`;

        css += `.preview-button-cta {\n`;
        css += `  background-color: var(--preview-secondary);\n`;
        css += `  color: var(--preview-text-on-secondary);\n`;
        css += `  border: 1px solid var(--preview-accent);\n`;
        css += `  padding: 0.75rem 1.5rem;\n`;
        css += `  border-radius: 0.375rem;\n`;
        css += `  margin-top: 1rem;\n`;
        css += `  cursor: pointer;\n`;
        css += `}\n\n`;

        css += `.preview-card {\n`;
        css += `  background-color: var(--preview-card-bg);\n`;
        css += `  color: var(--preview-text-on-card);\n`;
        css += `  border: 1px solid var(--preview-accent);\n`;
        css += `  padding: 1.5rem;\n`;
        css += `  border-radius: 0.5rem;\n`;
        css += `  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);\n`;
        css += `}\n\n`;

        css += `.preview-card-title {\n`;
        css += `  color: var(--palette-color-1); /* Example, can be dynamic */\n`;
        css += `  font-size: 1.25rem;\n`;
        css += `  font-weight: bold;\n`;
        css += `  margin-bottom: 0.75rem;\n`;
        css += `}\n\n`;
        
        css += `.preview-button-outline {\n`;
        css += `  border: 1px solid var(--palette-color-2); /* Example, can be dynamic */\n`;
        css += `  color: var(--palette-color-2);\n`;
        css += `  background-color: transparent;\n`;
        css += `  padding: 0.5rem 1rem;\n`;
        css += `  border-radius: 0.375rem;\n`;
        css += `  margin-top: 1rem;\n`;
        css += `  cursor: pointer;\n`;
        css += `}\n\n`;

        css += `.preview-footer {\n`;
        const footerBg = simulatedPalette[simulatedPalette.length - 1] || primaryColor;
        css += `  background-color: ${footerBg};\n`;
        css += `  color: ${getContrastColor(footerBg)};\n`;
        css += `  padding: 1rem;\n`;
        css += `  text-align: center;\n`;
        css += `  font-size: 0.875rem;\n`;
        css += `}\n`;

        return css;
      };