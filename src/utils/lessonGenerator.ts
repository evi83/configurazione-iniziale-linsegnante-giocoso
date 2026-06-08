import exercisesData from '../data/exercises.json';

// Helper function to get a random element from an array
const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a math exercise
export const generateMathExercise = (grade: number) => {
  const gradeKey = `grade${grade}` as keyof typeof exercisesData.math;
  const availableExercises = exercisesData.math[gradeKey];

  if (!availableExercises || availableExercises.length === 0) {
    return {
      question: "Nessun esercizio disponibile per questa classe di matematica.",
      answer: 0,
      type: "input"
    };
  }

  const exercise = getRandomElement(availableExercises);

  // For input type, ensure options are not present
  if (exercise.type === 'input') {
    return { ...exercise, options: undefined };
  }
  return exercise;
};

// Function to generate an Italian exercise
export const generateItalianExercise = (grade: number) => {
  const gradeKey = `grade${grade}` as keyof typeof exercisesData.italian;
  const availableExercises = exercisesData.italian[gradeKey];

  if (!availableExercises || availableExercises.length === 0) {
    return {
      question: "Nessun esercizio disponibile per questa classe di italiano.",
      answer: "",
      type: "input"
    };
  }

  const exercise = getRandomElement(availableExercises);

  // For input type, ensure options are not present
  if (exercise.type === 'input' || exercise.type === 'fill-in-the-blank') {
    return { ...exercise, options: undefined };
  }
  return exercise;
};
