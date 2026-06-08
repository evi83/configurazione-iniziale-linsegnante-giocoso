import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  $variant?: 'filled' | 'tonal' | 'outlined' | 'elevated' | 'success' | 'error';
  $size?: 'small' | 'medium' | 'large';
}

export const Button = styled(motion.button).attrs<ButtonProps>(() => ({
  whileHover: { scale: 1.04, y: -1 },
  whileTap: { scale: 0.96 },
}))<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  letter-spacing: 0.1px;
  
  /* MD3 Pill Shape */
  border-radius: ${({ theme }) => theme.borderRadiusFull};

  /* Sizes */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          height: 32px;
        `;
      case 'large':
        return `
          padding: 1rem 2rem;
          font-size: 1.4rem;
          height: 56px;
        `;
      case 'medium':
      default:
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.1rem;
          height: 48px;
        `;
    }
  }}

  /* MD3 Button Variants */
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'tonal':
        return `
          background: ${theme.primaryContainer};
          color: ${theme.onPrimaryContainer};
          &:hover {
            background: #5c439e;
          }
        `;
      case 'outlined':
        return `
          background: transparent;
          color: ${theme.primary};
          border: 2px solid ${theme.border};
          &:hover {
            background: rgba(208, 188, 255, 0.08);
            border-color: ${theme.primary};
          }
        `;
      case 'elevated':
        return `
          background: ${theme.surface};
          color: ${theme.primary};
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
          &:hover {
            background: #2d2a33;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.4);
          }
        `;
      case 'success':
        return `
          background: ${theme.success};
          color: ${theme.background};
          font-weight: 800;
          box-shadow: 0px 4px 10px rgba(129, 199, 132, 0.3);
          &:hover {
            background: #a5d6a7;
          }
        `;
      case 'error':
        return `
          background: ${theme.error};
          color: ${theme.onError};
          font-weight: 800;
          box-shadow: 0px 4px 10px rgba(242, 184, 181, 0.3);
          &:hover {
            background: #f9dedc;
          }
        `;
      case 'filled':
      default:
        return `
          background: ${theme.primary};
          color: ${theme.onPrimary};
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
          &:hover {
            background: #e8def8;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
