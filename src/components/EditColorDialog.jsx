import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

    const EditColorDialog = ({ editingColor, setEditingColor, saveEditedColor }) => {
      const [currentColor, setCurrentColor] = useState('');

      useEffect(() => {
        if (editingColor) {
          setCurrentColor(editingColor.color);
        }
      }, [editingColor]);

      if (!editingColor) return null;

      const handleColorInputChange = (e) => {
        setCurrentColor(e.target.value);
      };
      
      const handleHexInputChange = (e) => {
        let value = e.target.value;
        if (!value.startsWith('#')) {
            value = '#' + value.replace(/[^0-9a-fA-F]/g, '');
        } else {
            value = '#' + value.substring(1).replace(/[^0-9a-fA-F]/g, '');
        }
        
        if (value.length <= 7) {
            setCurrentColor(value);
        }
      };

      const handleSave = () => {
        if (/^#[0-9A-F]{6}$/i.test(currentColor)) {
            saveEditedColor(currentColor);
        } else {
            alert("Format de couleur hexadécimal invalide. Utilisez #RRGGBB.");
        }
      };
      
      return (
        <AlertDialog open={!!editingColor} onOpenChange={(isOpen) => !isOpen && setEditingColor(null)}>
          <AlertDialogContent className="bg-card border-border text-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Modifier la couleur</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Utilisez le sélecteur de couleur ou entrez une valeur hexadécimale.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-24 h-24 rounded-lg border-2 border-muted" style={{ backgroundColor: currentColor }}></div>
                <Input 
                    type="color" 
                    value={currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#000000'} 
                    onChange={handleColorInputChange}
                    className="w-full h-12 p-1 rounded-md cursor-pointer bg-input border-border"
                />
                <Input 
                    type="text" 
                    value={currentColor} 
                    onChange={handleHexInputChange}
                    maxLength={7}
                    placeholder="#RRGGBB"
                    className="font-mono bg-input border-border placeholder-muted-foreground text-foreground focus:ring-primary"
                />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setEditingColor(null)} className="border-border hover:bg-muted">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">Sauvegarder</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };

    export default EditColorDialog;