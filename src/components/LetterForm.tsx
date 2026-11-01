import { useState } from 'react';
import { db } from '../lib/firebase.ts';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

export default function LetterForm({ onSend }: { onSend: () => void }) {
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [font, setFont] = useState('sans');
  const [paperColor, setPaperColor] = useState('cream');
  const [stamp, setStamp] = useState('heart');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'letters'), {
      content,
      authorName,
      isPublic,
      styleOptions: { font, paperColor, stamp },
      accessCode: Math.random().toString(36).substring(7),
      createdAt: serverTimestamp(),
    });
    onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8 bg-surface rounded-xl border border-border">
      <textarea
        className="w-full h-40 p-4 mb-4 rounded-lg bg-surface-sub border border-border"
        placeholder="Viết điều gì đó..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        className="w-full p-4 mb-4 rounded-lg bg-surface-sub border border-border"
        placeholder="Tên (ẩn danh nếu trống)"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
      />
      <div className="flex gap-4 mb-4">
        <select value={font} onChange={(e) => setFont(e.target.value)} className="p-2 bg-surface-sub border border-border rounded">
          <option value="sans">Sans</option>
          <option value="serif">Serif</option>
        </select>
        <select value={paperColor} onChange={(e) => setPaperColor(e.target.value)} className="p-2 bg-surface-sub border border-border rounded">
          <option value="cream">Kem</option>
          <option value="white">Trắng</option>
        </select>
      </div>
      <label className="flex items-center gap-2 mb-6 text-text-sub">
        <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
        Gửi vào khoảng chung (Công khai)
      </label>
      <button type="submit" className="w-full px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-hover">
        Gửi thư
      </button>
    </form>
  );
}
