/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { db } from './lib/firebase.ts';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useTheme } from './context/ThemeContext.tsx';
import LetterForm from './components/LetterForm.tsx';
import Intro from './components/Intro.tsx';
import { Eye, EyeOff } from 'lucide-react';

interface Letter {
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
  createdAt: any;
}


export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState<'home' | 'write' | 'wall' | 'admin'>('home');
  const [letters, setLetters] = useState<Letter[]>([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (view === 'wall') {
      fetchLetters();
    }
  }, [view]);

  const fetchLetters = async () => {
    const q = query(collection(db, 'letters'), where('isPublic', '==', true), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const fetchedLetters: Letter[] = [];
    querySnapshot.forEach((doc) => {
      fetchedLetters.push({ id: doc.id, ...doc.data() } as Letter);
    });
    setLetters(fetchedLetters);
  };

  const handleAdminLogin = () => {
    if (password.trim() === 'Tiemkyuc') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('Sai mật khẩu!');
    }
  };

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-text-main font-sans transition-colors">
      <header className="flex items-center justify-between gap-8 px-8 py-6 border-b border-border">
        <button onClick={() => setView('home')} className="text-xl font-bold tracking-tight text-primary">
          Lục Lạc Thư
        </button>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <button onClick={() => setView('wall')} className="hover:text-primary transition-colors">Thư công khai</button>
          <button onClick={toggleTheme} className="text-xl">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={() => setView('admin')} className="text-xl">୨୧</button>
        </nav>
        <button onClick={() => setView('write')} className="px-4 py-2 text-xs font-medium text-white bg-primary rounded-full hover:bg-primary-hover">
          Viết thư
        </button>
      </header>

      <main className="p-8">
        {view === 'home' && (
          <div className="max-w-2xl mx-auto text-center py-20">
            <h1 className="text-4xl font-light mb-6 text-primary">một nơi để gửi những điều chưa nói</h1>
            <p className="text-text-sub mb-10">
              ୨୧ ─────── ୨୧
              <br/>
              Có những lời vốn chẳng cần người nhận biết ta là ai...
            </p>
            <button onClick={() => setView('write')} className="px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover">
              Viết thư ngay
            </button>
          </div>
        )}
        {view === 'wall' && (
          <div>
            <h2 className="text-2xl font-light mb-6 text-text-main">Thư công khai</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {letters.map((letter) => (
                <div key={letter.id} className="p-6 border border-border rounded-xl bg-surface">
                  <p className="mb-2">{letter.content}</p>
                  <p className="text-xs text-text-sub">{letter.authorName || 'Ẩn danh'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {view === 'write' && (
          <div>
            <h2 className="text-2xl font-light mb-6 text-text-main">Viết thư</h2>
            <LetterForm onSend={() => setView('wall')} />
          </div>
        )}
        {view === 'admin' && (
          isAdmin ? (
            <div className="max-w-4xl mx-auto p-8 border border-border rounded-xl bg-surface">
              <h2 className="text-2xl font-light mb-6 text-text-main">Admin Dashboard</h2>
              <button onClick={() => setIsAdmin(false)} className="mb-4 px-4 py-2 bg-primary text-white rounded-full">Đăng xuất</button>
              <div className="space-y-4">
                {/* Simplified letter management */}
                {letters.map((letter) => (
                  <div key={letter.id} className="p-4 border border-border rounded-lg bg-surface-sub">
                    <p>{letter.content}</p>
                    <p className="text-xs text-text-sub mt-2">{letter.createdAt?.toDate().toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-sm mx-auto p-8 border border-border rounded-xl bg-surface">
              <h2 className="text-2xl font-light mb-6 text-text-main">Đăng nhập chủ hòm thư</h2>
              <div className="relative mb-4">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Mật khẩu" 
                  className="w-full p-4 rounded-lg bg-surface-sub border border-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button 
                onClick={handleAdminLogin}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover"
              >
                Đăng nhập
              </button>
            </div>
          )
        )}
      </main>
    </div>
  );
}

