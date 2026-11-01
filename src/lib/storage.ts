export interface Letter {
  id: string;
  content: string;
  authorName?: string;
  isPublic: boolean;
  styleOptions: {
    font: string;
    paperColor: string;
    stamp: string;
  };
  accessCode: string;
  createdAt: string;
}

const STORAGE_KEY = 'luc_lac_thu_letters';

export const saveLetter = (letter: Letter) => {
  const letters = getLetters();
  letters.push(letter);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
};

export const getLetters = (): Letter[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const deleteLetter = (id: string, accessCode: string) => {
  const letters = getLetters();
  const filtered = letters.filter(l => !(l.id === id && l.accessCode === accessCode));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
