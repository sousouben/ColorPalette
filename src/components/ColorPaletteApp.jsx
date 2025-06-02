import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Wand2,
  Palette,
  Copy,
  Download,
  Trash2,
  Edit3,
  FileJson,
  Link as LinkIcon,
  Moon,
  Sun,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import {
  extractColorsFromImage,
  generatePaletteFromKeyword,
  filterColors,
  chroma,
} from "@/lib/colorUtils";
import {
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
  suggestedKeywords,
} from "@/lib/constants";
import PaletteDisplay from "@/components/PaletteDisplay";
import GenerationTabs from "@/components/GenerationTabs";
import PreviewTabContent from "@/components/PreviewTabContent";
import ExportTabContent from "@/components/ExportTabContent";
import HistoryTabContent from "@/components/HistoryTabContent";
import EditColorDialog from "@/components/EditColorDialog";

const ColorPaletteApp = () => {
  const [palette, setPalette] = useState([]);
  const [source, setSource] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [editingColor, setEditingColor] = useState(null);
  const [theme, setTheme] = useState("dark");
  const [previewColor, setPreviewColor] = useState(null);
  const [numColors, setNumColors] = useState(5);
  const [selectedFont, setSelectedFont] = useState(null);

  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const jsonImportInputRef = useRef(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem("colorPaletteHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("colorPaletteTheme");

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }

    const params = new URLSearchParams(window.location.search);
    const paletteParam = params.get("palette");
    if (paletteParam) {
      const colorsFromUrl = paletteParam
        .split(",")
        .filter((c) => /^#[0-9A-F]{6}$/i.test(c))
        .slice(0, 5);
      if (colorsFromUrl.length > 0) {
        setPalette(colorsFromUrl);
        setSource("shared_link");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("colorPaletteHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (palette.length > 0 && !previewColor) {
      setPreviewColor(palette[0]);
    } else if (palette.length === 0) {
      setPreviewColor(null);
    }
  }, [palette, previewColor]);

  const updatePalette = (newColors, currentSource) => {
    const finalColors = newColors.slice(0, numColors);
    setPalette(finalColors);
    addToHistory(finalColors, currentSource);
  };

  const addToHistory = (newPalette, currentSource) => {
    if (newPalette && newPalette.length > 0) {
      setHistory((prev) =>
        [
          {
            palette: newPalette,
            date: new Date().toISOString(),
            source: currentSource,
          },
          ...prev,
        ].slice(0, 10)
      );
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        title: "Erreur",
        description: "L'image est trop grande (max 5Mo).",
        variant: "destructive",
      });
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Erreur",
        description: "Format d'image non supporté (PNG, JPG).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const currentSource = "image";
    setSource(currentSource);
    try {
      const colors = await extractColorsFromImage(file);
      updatePalette(filterColors(colors), currentSource);
      toast({
        title: "Succès",
        description: "Palette générée à partir de l'image !",
      });
    } catch (error) {
      console.error("Error extracting colors:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'extraire les couleurs.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleKeywordSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast({
        title: "Attention",
        description: "Veuillez entrer un mot-clé.",
        variant: "default",
      });
      return;
    }
    setIsLoading(true);
    const currentSource = "keyword";
    setSource(currentSource);
    setTimeout(() => {
      const colors = generatePaletteFromKeyword(keyword);
      updatePalette(filterColors(colors), currentSource);
      toast({
        title: "Succès",
        description: `Palette générée pour "${keyword}"!`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleRegenerateKeywordPalette = () => {
    if (!keyword.trim()) {
      toast({
        title: "Attention",
        description: "Veuillez entrer un mot-clé pour régénérer.",
        variant: "default",
      });
      return;
    }
    setIsLoading(true);
    const currentSource = "keyword_regenerate";
    setSource(currentSource);
    setTimeout(() => {
      const colors = generatePaletteFromKeyword(keyword + Math.random());
      updatePalette(filterColors(colors), currentSource);
      toast({
        title: "Succès",
        description: `Nouvelle palette générée pour "${keyword}"!`,
      });
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        toast({
          title: "Copié !",
          description: `${text.substring(
            0,
            30
          )}... copié dans le presse-papiers.`,
        })
      )
      .catch(() =>
        toast({
          title: "Erreur",
          description: "Impossible de copier.",
          variant: "destructive",
        })
      );
  };

  const exportPaletteFile = (format) => {
    if (palette.length === 0) {
      toast({
        title: "Attention",
        description: "Aucune palette à exporter.",
        variant: "default",
      });
      return;
    }
    let content;
    let filename;
    let mimeType;

    if (format === "css") {
      content = palette
        .map((color, i) => `--color-palette-${i + 1}: ${color};`)
        .join("\n");
      filename = "palette-variables.css";
      mimeType = "text/css";
    } else if (format === "json") {
      content = JSON.stringify({ palette }, null, 2);
      filename = "palette.json";
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Exporté !",
      description: `Palette exportée en ${format.toUpperCase()}.`,
    });
  };

  const handleImportJson = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier JSON.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (importedData && Array.isArray(importedData.palette)) {
          const validColors = importedData.palette.filter((color) =>
            /^#[0-9A-F]{6}$/i.test(color)
          );
          if (validColors.length > 0) {
            const currentSource = "json_import";
            setSource(currentSource);
            updatePalette(validColors, currentSource);
            toast({
              title: "Succès",
              description: "Palette importée avec succès !",
            });
          } else {
            toast({
              title: "Erreur",
              description: "Le fichier JSON ne contient pas de palette valide.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erreur",
            description: "Format JSON invalide pour la palette.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier JSON.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    if (jsonImportInputRef.current) jsonImportInputRef.current.value = "";
  };

  const sharePalette = () => {
    if (palette.length === 0) {
      toast({
        title: "Attention",
        description: "Aucune palette à partager.",
        variant: "default",
      });
      return;
    }
    const params = new URLSearchParams();
    params.append("palette", palette.join(","));
    const shareUrl = `${window.location.origin}${
      window.location.pathname
    }?${params.toString()}`;
    copyToClipboard(shareUrl);
  };

  const startEditing = (index, color) => {
    setEditingColor({ index, color });
  };

  const saveEditedColor = (newColor) => {
    if (editingColor) {
      const newPalette = [...palette];
      newPalette[editingColor.index] = newColor;
      updatePalette(newPalette, "manual_edit");
      setEditingColor(null);
      toast({
        title: "Couleur modifiée",
        description: "La couleur a été mise à jour.",
      });
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      localStorage.setItem("colorPaletteTheme", newTheme);
      toast({
        title: "Thème changé",
        description: `Passage au thème ${
          newTheme === "dark" ? "sombre" : "clair"
        }.`,
      });
      return newTheme;
    });
  };

  const loadFromHistory = (histItem) => {
    updatePalette(histItem.palette, histItem.source);
    toast({
      title: "Chargé",
      description: "Palette chargée depuis l'historique.",
    });
  };

  const clearHistory = () => {
    setHistory([]);
    toast({
      title: "Historique vidé",
      description: "L'historique des palettes a été effacé.",
    });
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl w-full">
      <header className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
        >
          ColorPalette AI
        </motion.h1>
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6 text-slate-800" />
          ) : (
            <Sun className="h-6 w-6 text-yellow-400" />
          )}
        </Button>
      </header>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mb-6 bg-muted/50 dark:bg-slate-700/50 p-2 rounded-lg">
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Générer
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={palette.length === 0}
          >
            Prévisualiser
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={palette.length === 0}
          >
            Exporter
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Historique
          </TabsTrigger>
        </TabsList>

        <GenerationTabs
          handleImageUpload={handleImageUpload}
          fileInputRef={fileInputRef}
          handleKeywordSubmit={handleKeywordSubmit}
          keyword={keyword}
          setKeyword={setKeyword}
          suggestedKeywords={suggestedKeywords}
          source={source}
          palette={palette}
          handleRegenerateKeywordPalette={handleRegenerateKeywordPalette}
          numColors={numColors}
          setNumColors={setNumColors}
          handleImportJson={handleImportJson}
          jsonImportInputRef={jsonImportInputRef}
        />

        <PreviewTabContent
          palette={palette}
          previewColor={previewColor}
          setPreviewColor={setPreviewColor}
          theme={theme}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
        />
        <ExportTabContent
          palette={palette}
          exportPalette={exportPaletteFile}
          sharePalette={sharePalette}
          selectedFont={selectedFont}
          theme={theme}
          previewColor={previewColor}
        />
        <HistoryTabContent
          history={history}
          clearHistory={clearHistory}
          loadFromHistory={loadFromHistory}
        />
      </Tabs>

      <PaletteDisplay
        palette={palette}
        copyToClipboard={copyToClipboard}
        startEditing={startEditing}
        chroma={chroma}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-primary border-r-primary border-b-muted border-l-muted rounded-full"
          ></motion.div>
        </div>
      )}

      <EditColorDialog
        editingColor={editingColor}
        setEditingColor={setEditingColor}
        saveEditedColor={saveEditedColor}
      />

      <footer className="text-center mt-12 text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Color Palette par wpdevdesigns.</p>
      </footer>
    </div>
  );
};

export default ColorPaletteApp;
