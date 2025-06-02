import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { TabsContent } from '@/components/ui/tabs';
    import { CheckCircle, Type, SunMoon, Contrast, Eye, Edit, Save, Link as LinkIcon, Printer, Copy, Folder, Zap, UploadCloud, Brain, Languages, Smartphone, Users, Heart, BarChart, TrendingUp, ListChecks } from 'lucide-react';

    const featuresList = [
      { icon: <Type className="h-5 w-5 text-blue-400" />, title: "Choix de police (typographie)", description: "Sélecteur de polices Google Fonts à associer à la palette (aperçu en direct)." },
      { icon: <SunMoon className="h-5 w-5 text-yellow-400" />, title: "Dark / Light mode", description: "Toggle clair/sombre avec transition fluide. Adaptation automatique à la palette." },
      { icon: <Contrast className="h-5 w-5 text-green-400" />, title: "Test de contraste automatique", description: "Vérifie la lisibilité des textes avec la palette (accessibilité WCAG)." },
      { icon: <Eye className="h-5 w-5 text-purple-400" />, title: "Preview UI components", description: "Affiche la palette sur des composants simulés : bouton, carte, fond, input." },
      { icon: <Edit className="h-5 w-5 text-orange-400" />, title: "Customisation manuelle", description: "Permet de cliquer sur une couleur et l’ajuster avec un color-picker." },
      { icon: <Save className="h-5 w-5 text-indigo-400" />, title: "Sauvegarde dans le navigateur", description: "Historique des palettes dans le localStorage." },
      { icon: <LinkIcon className="h-5 w-5 text-sky-400" />, title: "Lien partageable", description: "Génère une URL unique avec paramètres pour partager une palette." },
      { icon: <Printer className="h-5 w-5 text-pink-400" />, title: "Aperçu d’impression", description: "Mode \"print preview\" de la palette sur feuille PDF A4 (design system exportable)." },
      { icon: <Copy className="h-5 w-5 text-lime-400" />, title: "Copie rapide", description: "Icône clic pour copier un hex code ou un bloc de CSS/JSON dans le presse-papiers." },
      { icon: <Folder className="h-5 w-5 text-cyan-400" />, title: "Organisation par projet", description: "Création de dossiers ou tags pour classer les palettes sauvegardées." },
      { icon: <Zap className="h-5 w-5 text-red-400" />, title: "Génération aléatoire intelligente", description: "Bouton \"Inspire-moi\" pour générer une palette basée sur la tendance du moment." },
      { icon: <UploadCloud className="h-5 w-5 text-teal-400" />, title: "Import de palettes existantes", description: "Import JSON, fichier .ase (Adobe Swatch Exchange) ou code hex." },
      { icon: <Brain className="h-5 w-5 text-fuchsia-400" />, title: "Suggestion de combinaisons typographiques", description: "En fonction de la palette, propose des couples de typographies harmonieux." },
      { icon: <Languages className="h-5 w-5 text-rose-400" />, title: "Traduction multilingue", description: "Interface disponible en plusieurs langues (ex : FR / EN / ES)." },
      { icon: <Smartphone className="h-5 w-5 text-amber-400" />, title: "Responsive optimisé mobile", description: "Interface mobile-first avec gestures (swipe entre palettes)." },
      { icon: <Users className="h-5 w-5 text-violet-400" />, title: "Palette collaborative", description: "Mode \"co-création\" pour modifier une palette à plusieurs (via Firebase ou socket)." },
      { icon: <Heart className="h-5 w-5 text-red-500" />, title: "Favoris", description: "Marquer une palette comme favorite (coeur ❤️ + classement auto)." },
      { icon: <BarChart className="h-5 w-5 text-emerald-400" />, title: "Statistiques", description: "Voir quelles couleurs ou styles sont les plus générés ou populaires." },
      { icon: <TrendingUp className="h-5 w-5 text-light-blue-400" />, title: "Tendance du moment", description: "Page \"explorer\" avec les palettes les plus aimées ou récentes." },
    ];

    const FeaturesTabContent = () => {
      return (
        <TabsContent value="features">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center">
                  <ListChecks className="mr-3 h-7 w-7" /> Fonctionnalités Avancées (Idées)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Voici une liste de fonctionnalités qui pourraient être ajoutées pour enrichir l'expérience ColorPalette AI.
                  Certaines sont déjà implémentées, d'autres sont des pistes pour le futur !
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuresList.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start p-3 bg-background/50 rounded-lg border border-input hover:shadow-md transition-shadow"
                    >
                      <span className="mr-3 mt-1">{feature.icon}</span>
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      );
    };

    export default FeaturesTabContent;