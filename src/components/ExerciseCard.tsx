import styled from 'styled-components';

export const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  text-align: center;
  max-width: 700px;
  width: 100%;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  border: 2px solid ${({ theme }) => theme.border};
`;

export const QuestionText = styled.p`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export const FeedbackMessage = styled.p<{ $isCorrect?: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  margin-top: 1.5rem;
  color: ${({ theme, $isCorrect }) => ($isCorrect ? theme.success : theme.error)};
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const InputField = styled.input`
  padding: 1rem 1.5rem;
  font-size: 1.8rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  text-align: center;
  width: 150px;
  max-width: 100%;
  transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.secondary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.secondary}40;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textSecondary};
  }
`;
