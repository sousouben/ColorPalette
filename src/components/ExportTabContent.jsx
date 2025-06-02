import React from 'react';
    import { motion } from 'framer-motion';
    import { Download, Link as LinkIcon, Copy } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TabsContent } from '@/components/ui/tabs';
    import { useToast } from '@/components/ui/use-toast';
    import { generatePreviewCss } from '@/lib/colorUtils';

    const ExportTabContent = ({ palette, exportPalette, sharePalette, selectedFont, theme, previewColor }) => {
      const { toast } = useToast();

      const handleExportPreviewCss = () => {
        if (palette.length === 0) {
          toast({ title: "Attention", description: "Aucune palette à prévisualiser ou exporter.", variant: "default" });
          return;
        }
        const cssContent = generatePreviewCss(palette, selectedFont, theme, previewColor);
        const blob = new Blob([cssContent], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'preview-styles.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Exporté !", description: "CSS de la prévisualisation exporté." });
      };

      const handleCopyPreviewCss = () => {
        if (palette.length === 0) {
          toast({ title: "Attention", description: "Aucune palette à prévisualiser ou copier.", variant: "default" });
          return;
        }
        const cssContent = generatePreviewCss(palette, selectedFont, theme, previewColor);
        navigator.clipboard.writeText(cssContent)
          .then(() => toast({ title: "Copié !", description: "CSS de la prévisualisation copié." }))
          .catch(() => toast({ title: "Erreur", description: "Impossible de copier le CSS.", variant: "destructive" }));
      };


      return (
        <TabsContent value="export">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Exporter & Partager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button onClick={() => exportPalette('css')} variant="outline" className="w-full border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/20">
                    <Download className="mr-2 h-4 w-4" /> Exporter Palette CSS
                  </Button>
                  <Button onClick={() => exportPalette('json')} variant="outline" className="w-full border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20">
                    <Download className="mr-2 h-4 w-4" /> Exporter Palette JSON
                  </Button>
                  <Button onClick={handleExportPreviewCss} variant="outline" className="w-full border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
                    <Download className="mr-2 h-4 w-4" /> Exporter CSS Prévisualisation
                  </Button>
                  <Button onClick={handleCopyPreviewCss} variant="outline" className="w-full border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/20">
                    <Copy className="mr-2 h-4 w-4" /> Copier CSS Prévisualisation
                  </Button>
                </div>
                 <Button onClick={sharePalette} variant="outline" className="w-full border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-500/20">
                  <LinkIcon className="mr-2 h-4 w-4" /> Partager Lien Palette
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      );
    };

    export default ExportTabContent;