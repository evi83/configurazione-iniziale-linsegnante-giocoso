import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Sliders } from 'lucide-react';
import { useStore } from '../store/store.ts';
import { themePresets } from '../theme.ts';
import { Button } from './Button.tsx';

const FloatingTrigger = styled(motion.button)`
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;

const PanelOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const Panel = styled(motion.div)`
  background: ${({ theme }) => theme.surface};
  width: 100%;
  max-width: 400px;
  height: 100%;
  box-shadow: -8px 0px 32px rgba(0, 0, 0, 0.4);
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.border};
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 1rem;
`;

const PanelTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${({ theme }) => theme.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.onSurface};
  margin: 1.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PresetGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const PresetButton = styled(motion.button)<{ $active: boolean; $previewBg: string }>`
  background: ${({ theme, $active }) => $active ? theme.primaryContainer : 'rgba(255,255,255,0.03)'};
  border: 2px solid ${({ theme, $active }) => $active ? theme.primary : theme.border};
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: ${({ theme }) => theme.onSurface};
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  text-align: left;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${({ theme }) => theme.primary}80;
  }
`;

const ColorPreviewGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const ColorCircle = styled.div<{ $bg: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  border: 1px solid rgba(255,255,255,0.2);
`;

const CustomColorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: rgba(0,0,0,0.15);
  padding: 1.25rem;
  border-radius: 20px;
  border: 1px dashed ${({ theme }) => theme.border};
`;

const ColorPickerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColorLabel = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: ${({ theme }) => theme.onSurfaceVariant};
`;

const StyledInputColor = styled.input`
  -webkit-appearance: none;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  background: none;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: 2px solid ${({ theme }) => theme.border};
    border-radius: 50%;
  }
`;

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { themeConfig, applyPreset, updateCustomColor } = useStore();

  return (
    <>
      <FloatingTrigger 
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        title="Personalizza Colori"
      >
        <Palette size={24} />
      </FloatingTrigger>

      <AnimatePresence>
        {isOpen && (
          <PanelOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <Panel
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <PanelHeader>
                <PanelTitle>
                  <Palette size={28} /> Tavolozza Colori
                </PanelTitle>
                <Button 
                  $variant="outlined" 
                  $size="small" 
                  onClick={() => setIsOpen(false)}
                  style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%' }}
                >
                  <X size={18} />
                </Button>
              </PanelHeader>

              <SectionTitle>✨ Scegli un Tema Magico</SectionTitle>
              <PresetGrid>
                {(Object.keys(themePresets) as Array<keyof typeof themePresets>).map((key) => {
                  const preset = themePresets[key];
                  const isActive = themeConfig.presetKey === key;
                  return (
                    <PresetButton
                      key={key}
                      $active={isActive}
                      $previewBg={preset.background}
                      onClick={() => applyPreset(key)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>{preset.name}</span>
                      <ColorPreviewGroup>
                        <ColorCircle $bg={preset.primary} />
                        <ColorCircle $bg={preset.secondary} />
                        <ColorCircle $bg={preset.background} />
                        {isActive && <Check size={16} style={{ marginLeft: '8px', color: '#81C784' }} />}
                      </ColorPreviewGroup>
                    </PresetButton>
                  );
                })}
              </PresetGrid>

              <SectionTitle>
                <Sliders size={18} /> Crea i tuoi Colori
              </SectionTitle>
              <CustomColorContainer>
                <ColorPickerRow>
                  <ColorLabel>Colore Principale (Tasti e Titoli)</ColorLabel>
                  <StyledInputColor 
                    type="color" 
                    value={themeConfig.primary} 
                    onChange={(e) => updateCustomColor('primary', e.target.value)}
                  />
                </ColorPickerRow>

                <ColorPickerRow>
                  <ColorLabel>Colore Secondario (Dettagli)</ColorLabel>
                  <StyledInputColor 
                    type="color" 
                    value={themeConfig.secondary} 
                    onChange={(e) => updateCustomColor('secondary', e.target.value)}
                  />
                </ColorPickerRow>

                <ColorPickerRow>
                  <ColorLabel>Colore di Sfondo</ColorLabel>
                  <StyledInputColor 
                    type="color" 
                    value={themeConfig.background} 
                    onChange={(e) => updateCustomColor('background', e.target.value)}
                  />
                </ColorPickerRow>
              </CustomColorContainer>

              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <Button 
                  $variant="filled" 
                  style={{ width: '100%' }} 
                  onClick={() => setIsOpen(false)}
                >
                  Applica e Chiudi
                </Button>
              </div>
            </Panel>
          </PanelOverlay>
        )}
      </AnimatePresence>
    </>
  );
};
