import React from 'react';
    import { motion } from 'framer-motion';
    import { Trash2 } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TabsContent } from '@/components/ui/tabs';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

    const HistoryTabContent = ({ history, clearHistory, loadFromHistory }) => {
      return (
        <TabsContent value="history">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl text-primary">Historique des Palettes</CardTitle>
                {history.length > 0 && (
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Vider</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border text-foreground">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Vider l'historique ?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Cette action est irréversible et supprimera toutes les palettes sauvegardées localement.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border hover:bg-muted">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Confirmer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <p className="text-muted-foreground">Aucune palette dans l'historique.</p>
                ) : (
                  <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {history.map((item, index) => (
                      <motion.li 
                        key={`${item.date}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 bg-background/70 rounded-md border border-border hover:border-primary transition-colors cursor-pointer"
                        onClick={() => loadFromHistory(item)}
                      >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleString()} - Source: {item.source || 'Inconnue'}
                            </span>
                        </div>
                        <div className="flex space-x-1">
                          {item.palette.map((color, cIndex) => (
                            <div key={`${color}-${cIndex}`} className="w-5 h-5 rounded-sm" style={{ backgroundColor: color }}></div>
                          ))}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      );
    };

    export default HistoryTabContent;