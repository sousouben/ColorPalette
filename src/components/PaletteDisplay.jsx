import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Palette, Copy, Edit3 } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

    const PaletteDisplay = ({ palette, copyToClipboard, startEditing, chroma }) => {
      if (!palette || palette.length === 0) {
        return null;
      }

      return (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 w-full"
          >
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center"><Palette className="mr-3 h-7 w-7" /> Votre Palette</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
                  {palette.map((color, index) => (
                    <motion.div
                      key={`${color}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative p-3 rounded-lg shadow-md aspect-square flex flex-col justify-end"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(color)} className="text-slate-100 hover:bg-white/20">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => startEditing(index, color)} className="text-slate-100 hover:bg-white/20">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-mono text-xs break-all" style={{ color: chroma(color).luminance() > 0.5 ? '#000' : '#FFF' }}>{color}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      );
    };

    export default PaletteDisplay;