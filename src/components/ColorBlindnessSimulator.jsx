import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Eye, EyeOff } from 'lucide-react';

    const simulationTypes = [
      { id: 'none', label: 'Normal', icon: <EyeOff className="mr-2 h-4 w-4" /> },
      { id: 'protanopia', label: 'Protanopie', icon: <Eye className="mr-2 h-4 w-4" /> },
      { id: 'deuteranopia', label: 'Deutéranopie', icon: <Eye className="mr-2 h-4 w-4" /> },
      { id: 'tritanopia', label: 'Tritanopie', icon: <Eye className="mr-2 h-4 w-4" /> },
    ];

    const ColorBlindnessSimulator = ({ currentSimulation, setSimulationType }) => {
      return (
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-foreground">Simulateur de Daltonisme</h4>
          <div className="flex flex-wrap gap-2">
            {simulationTypes.map((sim) => (
              <Button
                key={sim.id}
                variant={currentSimulation === sim.id ? 'default' : 'outline'}
                onClick={() => setSimulationType(sim.id)}
                className="flex items-center"
              >
                {sim.icon}
                {sim.label}
              </Button>
            ))}
          </div>
        </div>
      );
    };

    export default ColorBlindnessSimulator;