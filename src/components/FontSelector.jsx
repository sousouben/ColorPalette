import React from 'react';
    import Select from 'react-select';
    import { googleFonts } from '@/lib/colorUtils';

    const FontSelector = ({ selectedFont, setSelectedFont, theme }) => {
      const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: theme === 'dark' ? 'hsl(var(--secondary))' : 'hsl(var(--background))',
          borderColor: theme === 'dark' ? 'hsl(var(--border))' : 'hsl(var(--input))',
          color: 'hsl(var(--foreground))',
          minHeight: '40px',
          height: '40px',
          boxShadow: 'none',
          '&:hover': {
            borderColor: theme === 'dark' ? 'hsl(var(--ring))' : 'hsl(var(--primary))',
          },
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: theme === 'dark' ? 'hsl(var(--secondary))' : 'hsl(var(--background))',
          zIndex: 50,
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? 'hsl(var(--primary))' : (state.isFocused ? (theme === 'dark' ? 'hsl(var(--accent))' : 'hsl(var(--accent))') : 'transparent'),
          color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
          '&:active': {
            backgroundColor: 'hsl(var(--primary))',
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'hsl(var(--foreground))',
        }),
        input: (provided) => ({
          ...provided,
          color: 'hsl(var(--foreground))',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: 'hsl(var(--muted-foreground))',
        }),
      };

      return (
        <Select
          options={googleFonts}
          value={selectedFont}
          onChange={setSelectedFont}
          styles={customStyles}
          placeholder="Choisir une police..."
          aria-label="Select a font"
        />
      );
    };

    export default FontSelector;