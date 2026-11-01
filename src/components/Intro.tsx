import { useState, useEffect } from 'react';

export default function Intro({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950">
      <div className="text-4xl mb-4">୨୧ ♡ ꕤ ｡ﾟ</div>
      <div className="w-64 h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
        <div className="h-full bg-purple-500 transition-all duration-75" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 text-purple-900 dark:text-purple-100">{progress}%</div>
    </div>
  );
}
