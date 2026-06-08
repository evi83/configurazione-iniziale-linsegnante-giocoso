import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  background: ${({ theme }) => theme.surface};
  padding: 1.25rem 1.75rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
`;

const AvatarCircle = styled(motion.div)<{ $expression: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ $expression, theme }) => {
    if ($expression === 'happy') return 'linear-gradient(135deg, #10b981, #34d399)';
    if ($expression === 'thinking') return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    if ($expression === 'encouraging') return 'linear-gradient(135deg, #38bdf8, #0284c7)';
    return `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
`;

const SpeechBubble = styled.div`
  position: relative;
  color: ${({ theme }) => theme.onSurface};
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.5;
  text-align: left;
`;

export type TeacherExpression = 'neutral' | 'thinking' | 'happy' | 'encouraging' | 'idea';

interface TeacherAvatarProps {
  message: string;
  expression?: TeacherExpression;
}

const expressionEmojis: Record<TeacherExpression, string> = {
  neutral: '👩‍🏫',
  thinking: '🤔',
  happy: '🎉',
  encouraging: '💪',
  idea: '💡'
};

export const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ message, expression = 'neutral' }) => {
  return (
    <AvatarContainer>
      <AnimatePresence mode="wait">
        <AvatarCircle
          key={expression}
          $expression={expression}
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ 
            scale: 1, 
            rotate: 0, 
            opacity: 1,
            y: [0, -4, 0]
          }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            y: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }
          }}
        >
          {expressionEmojis[expression]}
        </AvatarCircle>
      </AnimatePresence>
      <SpeechBubble>
        <motion.span
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.span>
      </SpeechBubble>
    </AvatarContainer>
  );
};
