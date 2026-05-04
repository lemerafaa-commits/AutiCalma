export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getCrisisMessage = (seconds: number) => {
  if (seconds < 30) return "Respire. Você está aqui, isso já ajuda.";
  if (seconds < 60) return "Fique perto. Sua presença já acalma.";
  if (seconds < 120) return "Reduza estímulos. Menos luz, menos som.";
  if (seconds < 180) return "Evite falar muito. O silêncio ajuda a regular.";
  if (seconds < 300) return "A crise vai passar. Continue presente.";
  return "Você está fazendo o melhor possível. Continue.";
};
