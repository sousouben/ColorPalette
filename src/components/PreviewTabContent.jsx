import React, { useEffect, useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Tabs, TabsContent, TabsList, TabsTrigger as RadixTabsTrigger } from '@/components/ui/tabs';
    import { CheckCircle, AlertTriangle, Palette as PaletteIcon, Type, ScrollText as FontSize, Baseline, Smartphone, Tablet, Monitor, Image as ImageIcon } from 'lucide-react';
    import * as contrast from 'wcag-contrast';
    import { getFontLink, simulateColorBlindness } from '@/lib/colorUtils';
    import FontSelector from '@/components/FontSelector';
    import { Slider } from '@/components/ui/slider';
    import { Label } from '@/components/ui/label';

    const ContrastBadge = ({ level, ratio, isPassing }) => {
      const bgColor = isPassing ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
      const textColor = isPassing ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300';
      const Icon = isPassing ? CheckCircle : AlertTriangle;

      return (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${bgColor} ${textColor}`}>
          <Icon className="h-4 w-4" />
          <span>{level}: {ratio.toFixed(2)} {isPassing ? '(Passe)' : '(Échoue)'}</span>
        </div>
      );
    };

    const MockupDisplay = ({ type, palette, theme, fontStyle }) => {
      const primaryColor = palette[0] || '#cccccc';
      const secondaryColor = palette[1] || '#aaaaaa';
      const accentColor = palette[2] || '#888888';
      const backgroundColor = theme === 'dark' ? '#1E293B' : '#F8FAFC';
      const textColor = theme === 'dark' ? '#E2E8F0' : '#1E293B';
      const textOnPrimary = contrast.hex(primaryColor, '#FFFFFF') > contrast.hex(primaryColor, '#000000') ? '#FFFFFF' : '#000000';

      let mockupContent;
      switch (type) {
        case 'businessCard':
          mockupContent = (
            <div style={{ ...fontStyle, backgroundColor: primaryColor, color: textOnPrimary, width: '320px', height: '180px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} className="flex flex-col justify-center items-center text-center transform scale-90 md:scale-100">
              <h3 className="text-xl font-bold">Votre Nom</h3>
              <p className="text-sm">Titre / Profession</p>
              <div className="mt-2 border-t pt-2 w-full" style={{ borderColor: accentColor }}>
                <p className="text-xs" style={{color: textOnPrimary }}>contact@example.com</p>
                <p className="text-xs" style={{color: textOnPrimary }}>+123 456 7890</p>
              </div>
            </div>
          );
          break;
        case 'websiteHeader':
          mockupContent = (
            <div style={{ ...fontStyle, backgroundColor: backgroundColor, color: textColor, width: '100%', maxWidth: '400px', border: `1px solid ${accentColor}`, borderRadius: '8px', overflow: 'hidden' }} className="transform scale-90 md:scale-100">
              <div style={{ backgroundColor: primaryColor, color: textOnPrimary, padding: '15px 20px' }} className="flex justify-between items-center">
                <span className="font-bold text-lg">Logo</span>
                <nav className="flex gap-3 text-sm"><span>Accueil</span><span>Services</span><span>Contact</span></nav>
              </div>
              <div style={{ padding: '30px 20px', backgroundColor: secondaryColor, color: contrast.hex(secondaryColor, '#FFFFFF') > contrast.hex(secondaryColor, '#000000') ? '#FFFFFF' : '#000000' }} className="text-center">
                <h1 className="text-2xl font-bold mb-2">Titre Accrocheur</h1>
                <p className="text-xs">Un sous-titre descriptif.</p>
              </div>
            </div>
          );
          break;
        case 'poster':
          mockupContent = (
             <div style={{ ...fontStyle, backgroundColor: secondaryColor, color: contrast.hex(secondaryColor, '#FFFFFF') > contrast.hex(secondaryColor, '#000000') ? '#FFFFFF' : '#000000', width: '200px', height: '300px', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', textAlign: 'center' }} className="transform scale-90 md:scale-100">
                <div>
                    <h2 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>ÉVÉNEMENT</h2>
                    <p className="text-md">Description</p>
                </div>
                <div style={{backgroundColor: primaryColor, color: textOnPrimary, padding: '5px 10px', borderRadius: '4px'}}>
                    <p className="text-sm font-bold">Date & Heure</p>
                </div>
            </div>
          );
          break;
        default:
          mockupContent = <p>Sélectionnez un type de mockup.</p>;
      }
      return <div className="flex justify-center items-center p-4 bg-muted rounded-lg min-h-[200px] md:min-h-[320px]">{mockupContent}</div>;
    };
    

    const PreviewTabContent = ({ palette, previewColor, setPreviewColor, theme, selectedFont, setSelectedFont }) => {
      const [fontSize, setFontSize] = useState(16);
      const [lineHeight, setLineHeight] = useState(1.5);
      const [previewDevice, setPreviewDevice] = useState('desktop');
      const [activeMockup, setActiveMockup] = useState('businessCard');
      
      useEffect(() => {
        if (selectedFont && selectedFont.value) {
          const fontLink = getFontLink(selectedFont.value);
          const existingLink = document.head.querySelector(`link[href="${fontLink}"]`);
          if (!existingLink) {
            const linkElement = document.createElement('link');
            linkElement.href = fontLink;
            linkElement.rel = 'stylesheet';
            document.head.appendChild(linkElement);
            return () => {
              if (document.head.contains(linkElement)) {
                  document.head.removeChild(linkElement);
              }
            };
          }
        }
      }, [selectedFont]);
      
      if (palette.length === 0) return null;

      const currentPreviewColor = previewColor || palette[0];
      
      const simulationType = 'none'; 
      const simulatedPalette = palette.map(color => simulateColorBlindness(color, simulationType));
      const simulatedPreviewColor = simulateColorBlindness(currentPreviewColor, simulationType);

      const textColorOnBackground = theme === 'dark' ? '#E2E8F0' : '#1E293B'; 
      const simulatedTextColor = simulateColorBlindness(textColorOnBackground, simulationType);

      const contrastRatio = contrast.hex(simulatedPreviewColor, simulatedTextColor);
      const wcagAAPasses = contrastRatio >= 4.5;
      const wcagAAAPasses = contrastRatio >= 7;

      const dynamicFontStyle = { 
        fontFamily: selectedFont ? `'${selectedFont.value}', sans-serif` : 'sans-serif',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
      };

      const safePaletteColor = (index, defaultColor = '#cccccc') => {
        return simulatedPalette[index] || defaultColor;
      };
      
      const primaryColor = safePaletteColor(0, simulatedPreviewColor);
      const secondaryColor = safePaletteColor(1, textColorOnBackground);
      const accentColor = safePaletteColor(2, '#888888');
      const backgroundColor = theme === 'dark' ? simulateColorBlindness('#1E293B', simulationType) : simulateColorBlindness('#F8FAFC', simulationType);
      const cardBgColor = theme === 'dark' ? simulateColorBlindness('#2C3E50', simulationType) : simulateColorBlindness('#FFFFFF', simulationType);
      const textOnPrimary = contrast.hex(primaryColor, '#FFFFFF') > contrast.hex(primaryColor, '#000000') ? '#FFFFFF' : '#000000';
      const textOnSecondary = contrast.hex(secondaryColor, '#FFFFFF') > contrast.hex(secondaryColor, '#000000') ? '#FFFFFF' : '#000000';
      const textOnBackground = contrast.hex(backgroundColor, '#FFFFFF') > contrast.hex(backgroundColor, '#000000') ? '#FFFFFF' : '#000000';
      const textOnCard = contrast.hex(cardBgColor, '#FFFFFF') > contrast.hex(cardBgColor, '#000000') ? '#FFFFFF' : '#000000';

      const deviceWidths = {
        desktop: '100%',
        tablet: '768px',
        mobile: '375px',
      };
      
      const mobileSpecificStyles = previewDevice === 'mobile' ? {
        heroTitleSize: 'text-xl',
        heroTextSize: 'text-xs',
        heroButtonPadding: 'px-2 py-1 text-xs',
        cardTitleSize: 'text-base',
        cardTextSize: 'text-xs',
        cardButtonPadding: 'px-2 py-1 text-xs',
        footerTextSize: 'text-xs',
        mainPadding: 'px-2 py-2',
        mainGap: 'gap-2',
        cardPadding: 'p-2',
        cardHeaderPadding: 'p-2',
        cardContentPadding: 'p-2 pt-0',
      } : {
        heroTitleSize: 'text-2xl md:text-4xl',
        heroTextSize: 'text-sm md:text-lg',
        heroButtonPadding: 'px-2 py-1 md:px-4 md:py-2 text-xs md:text-base',
        cardTitleSize: 'text-base md:text-xl',
        cardTextSize: 'text-xs md:text-sm',
        cardButtonPadding: 'px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm',
        footerTextSize: 'text-xs md:text-sm',
        mainPadding: 'px-2 md:px-4 py-4 md:py-8',
        mainGap: 'gap-2 md:gap-6',
        cardPadding: 'p-2 md:p-4',
        cardHeaderPadding: 'p-2 md:p-4',
        cardContentPadding: 'p-2 md:p-4 pt-0',
      };


      return (
        <TabsContent value="preview">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={dynamicFontStyle}>
            <Card className="bg-card border-border shadow-xl backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center"><PaletteIcon className="mr-3 h-7 w-7" />Prévisualisation Avancée</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-2 flex items-center"><PaletteIcon className="mr-2 h-5 w-5 text-primary"/>Couleur principale pour l'aperçu :</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                      {simulatedPalette.map((color, index) => (
                          <motion.button
                              key={index}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setPreviewColor(palette[index])}
                              className={`w-8 h-8 rounded-full border-2 ${currentPreviewColor === palette[index] ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                              style={{ backgroundColor: color }}
                              aria-label={`Set ${palette[index]} as preview color`}
                          />
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center"><Type className="mr-2 h-5 w-5 text-primary"/>Choix de Police</h4>
                    <FontSelector selectedFont={selectedFont} setSelectedFont={setSelectedFont} theme={theme} />
                  </div>
                  <div className="space-y-4">
                    <div>
                        <Label htmlFor="fontSizeSlider" className="flex items-center mb-1"><FontSize className="mr-2 h-4 w-4 text-primary"/>Taille de Police: {fontSize}px</Label>
                        <Slider id="fontSizeSlider" defaultValue={[16]} min={10} max={48} step={1} value={[fontSize]} onValueChange={(value) => setFontSize(value[0])} />
                    </div>
                    <div>
                        <Label htmlFor="lineHeightSlider" className="flex items-center mb-1"><Baseline className="mr-2 h-4 w-4 text-primary"/>Interligne: {lineHeight.toFixed(1)}</Label>
                        <Slider id="lineHeightSlider" defaultValue={[1.5]} min={1} max={3} step={0.1} value={[lineHeight]} onValueChange={(value) => setLineHeight(value[0])} />
                    </div>
                  </div>
                </div>
                <div className={`p-4 border rounded-lg bg-background/50`} style={dynamicFontStyle}>
                    <h3 className={`text-xl md:text-2xl font-bold mb-2`} style={{ color: primaryColor }}>Exemple de Titre H1</h3>
                    <p style={{color: textColorOnBackground}}>Ceci est un paragraphe d'exemple utilisant la police, la taille et l'interligne sélectionnés. Il utilise également une couleur de la palette pour le texte sur le fond actuel. Voyez comme la lisibilité est affectée par vos choix.</p>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary"/>Création de Mockups Automatiques (Concept)</h4>
                    <Tabs defaultValue="businessCard" onValueChange={setActiveMockup} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <RadixTabsTrigger value="businessCard">Carte Visite</RadixTabsTrigger>
                            <RadixTabsTrigger value="websiteHeader">Header Site</RadixTabsTrigger>
                            <RadixTabsTrigger value="poster">Poster</RadixTabsTrigger>
                        </TabsList>
                        <MockupDisplay type={activeMockup} palette={simulatedPalette} theme={theme} fontStyle={dynamicFontStyle} />
                    </Tabs>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Mini-Maquette de Site (Responsive)</h4>
                  <div className="flex justify-center gap-2 mb-4">
                    <Button variant={previewDevice === 'mobile' ? 'default' : 'outline'} size="icon" onClick={() => setPreviewDevice('mobile')}><Smartphone className="h-5 w-5"/></Button>
                    <Button variant={previewDevice === 'tablet' ? 'default' : 'outline'} size="icon" onClick={() => setPreviewDevice('tablet')}><Tablet className="h-5 w-5"/></Button>
                    <Button variant={previewDevice === 'desktop' ? 'default' : 'outline'} size="icon" onClick={() => setPreviewDevice('desktop')}><Monitor className="h-5 w-5"/></Button>
                  </div>
                  <div className="mx-auto overflow-hidden border rounded-lg bg-muted/10" style={{ width: deviceWidths[previewDevice], transition: 'width 0.3s ease-in-out' }}>
                    <div className="p-0 rounded-lg" style={{ backgroundColor: backgroundColor, color: textOnBackground, ...dynamicFontStyle }}>
                      <header className={`py-4 text-center rounded-t-lg preview-hero`} style={{ backgroundColor: primaryColor, color: textOnPrimary }}>
                        <h1 className={`${mobileSpecificStyles.heroTitleSize} font-bold`}>Titre Héroïque</h1>
                        <p className={`mt-1 ${mobileSpecificStyles.heroTextSize}`}>Un slogan accrocheur.</p>
                        <Button className={`mt-2 preview-button-cta ${mobileSpecificStyles.heroButtonPadding}`} style={{ backgroundColor: secondaryColor, color: textOnSecondary, borderColor: accentColor, ...dynamicFontStyle }}>Appel à l'Action</Button>
                      </header>
                      <main className={`${mobileSpecificStyles.mainPadding} grid ${previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} ${mobileSpecificStyles.mainGap}`}>
                        {[1, 2, 3].map(i => (
                          <Card key={i} className={`shadow-lg preview-card ${mobileSpecificStyles.cardPadding}`} style={{ backgroundColor: cardBgColor, color: textOnCard, borderColor: accentColor, ...dynamicFontStyle }}>
                            <CardHeader className={`${mobileSpecificStyles.cardHeaderPadding}`}>
                              <CardTitle className={`preview-card-title ${mobileSpecificStyles.cardTitleSize}`} style={{ color: safePaletteColor(i % simulatedPalette.length, primaryColor) }}>Carte {i}</CardTitle>
                            </CardHeader>
                            <CardContent className={`${mobileSpecificStyles.cardContentPadding}`}>
                              <p className={`${mobileSpecificStyles.cardTextSize}`}>Contenu de la carte.</p>
                              <Button variant="outline" className={`mt-2 w-full preview-button-outline ${mobileSpecificStyles.cardButtonPadding}`} style={{ borderColor: safePaletteColor((i+1) % simulatedPalette.length, secondaryColor), color: safePaletteColor((i+1) % simulatedPalette.length, secondaryColor), ...dynamicFontStyle }}>Lire Plus</Button>
                            </CardContent>
                          </Card>
                        ))}
                      </main>
                      <footer className={`text-center py-2 preview-footer ${mobileSpecificStyles.footerTextSize}`} style={{ backgroundColor: safePaletteColor(simulatedPalette.length -1, primaryColor), color: contrast.hex(safePaletteColor(simulatedPalette.length -1, primaryColor), '#FFFFFF') > contrast.hex(safePaletteColor(simulatedPalette.length -1, primaryColor), '#000000') ? '#FFFFFF' : '#000000' }}>
                        Pied de page.
                      </footer>
                    </div>
                  </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">Test de Contraste (WCAG)</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                        Texte ({simulatedTextColor}) sur fond de la couleur principale sélectionnée ({simulatedPreviewColor}).
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                       <ContrastBadge level="AA (Normal)" ratio={contrastRatio} isPassing={wcagAAPasses} />
                       <ContrastBadge level="AAA (Normal)" ratio={contrastRatio} isPassing={wcagAAAPasses} />
                    </div>
                     <p className="text-xs text-muted-foreground mt-2">
                        AA (Normal): Ratio ≥ 4.5. AAA (Normal): Ratio ≥ 7.0.
                    </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      );
    };

    export default PreviewTabContent;