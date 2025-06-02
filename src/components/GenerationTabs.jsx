import React from 'react';
    import { motion } from 'framer-motion';
    import { UploadCloud, Wand2, FileJson, RotateCcw, Palette, SlidersHorizontal } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TabsContent } from '@/components/ui/tabs';
    import { Slider } from "@/components/ui/slider";
    import { Label } from "@/components/ui/label";

    const GenerationTabs = ({
      handleImageUpload,
      fileInputRef,
      handleKeywordSubmit,
      keyword,
      setKeyword,
      suggestedKeywords,
      source,
      palette,
      handleRegenerateKeywordPalette,
      numColors,
      setNumColors,
      handleImportJson,
      jsonImportInputRef
    }) => {
      const MAX_COLORS = 5; 

      return (
        <TabsContent value="generate">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <Wand2 className="mr-3 h-7 w-7" /> Générer une Palette
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="numColorsSlider" className="flex items-center mb-2 text-sm font-medium text-foreground">
                    <SlidersHorizontal className="mr-2 h-4 w-4 text-primary"/>Nombre de couleurs (1-{MAX_COLORS}): {numColors}
                  </Label>
                  <Slider 
                    id="numColorsSlider" 
                    defaultValue={[5]} 
                    min={1} 
                    max={MAX_COLORS} 
                    step={1} 
                    value={[numColors]} 
                    onValueChange={(value) => setNumColors(value[0])} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary"/>Depuis une image</h3>
                    <Input type="file" accept="image/png, image/jpeg" onChange={handleImageUpload} ref={fileInputRef} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
                    <Button onClick={() => jsonImportInputRef.current.click()} variant="outline" className="w-full border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 dark:hover:bg-blue-500/20">
                      <FileJson className="mr-2 h-4 w-4" /> Importer Palette JSON
                    </Button>
                    <Input type="file" accept=".json" onChange={handleImportJson} ref={jsonImportInputRef} className="hidden"/>
                  </div>

                  <form onSubmit={handleKeywordSubmit} className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center"><Wand2 className="mr-2 h-5 w-5 text-primary"/>Depuis un mot-clé</h3>
                    <div className="flex gap-2">
                        <Input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Ex: énergie, vintage, zen..." className="flex-grow"/>
                        <Button type="submit" className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white">
                            <Palette className="mr-2 h-4 w-4" /> Générer
                        </Button>
                    </div>
                    {source && (source === 'keyword' || source === 'keyword_regenerate') && palette.length > 0 && (
                      <Button onClick={handleRegenerateKeywordPalette} variant="outline" className="w-full border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/20">
                        <RotateCcw className="mr-2 h-4 w-4" /> Regénérer pour "{keyword}"
                      </Button>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {suggestedKeywords.map(kw => (
                        <Button key={kw} type="button" variant="ghost" size="sm" className="text-xs bg-muted/50 hover:bg-muted" onClick={() => { setKeyword(kw); handleKeywordSubmit({ preventDefault: () => {} }); }}>
                          {kw}
                        </Button>
                      ))}
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      );
    };

    export default GenerationTabs;