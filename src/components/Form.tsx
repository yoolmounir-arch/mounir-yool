import React, { useState } from 'react';
import { Level, ContentType } from '../types';
import { Sparkles, Loader2, BookA, AlignLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface FormProps {
  onGenerate: (level: Level, type: ContentType, topic: string) => void;
  isLoading: boolean;
}

export function Form({ onGenerate, isLoading }: FormProps) {
  const [level, setLevel] = useState<Level>('A2');
  const [type, setType] = useState<ContentType>('Story');
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onGenerate(level, type, topic);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-2xl rounded-2xl p-5 md:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-white/60 mb-6 max-w-xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-5">
          {/* Level Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              <BookA className="w-3.5 h-3.5 text-indigo-500" />
              Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['A2', 'B1'] as Level[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`py-1.5 px-2 rounded-lg border transition-all font-bold flex items-center justify-center gap-1 ${
                    level === l 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'border-slate-200/60 hover:border-indigo-200 text-slate-500 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{l}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-500" />
              Content Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['Story', 'Article', 'Dialogue', 'Daily Life Text'] as ContentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-1.5 px-2 rounded-lg border transition-all text-[11px] font-medium text-center leading-snug flex items-center justify-center ${
                    type === t 
                      ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm' 
                      : 'border-slate-200/60 hover:border-amber-200 text-slate-500 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Input */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase" htmlFor="topic">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Topic (Optional)
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. A visit to Berlin, Making a friend..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200/80 bg-white/50 focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition-all text-[13px] text-slate-700 placeholder:text-slate-400 outline-none"
            dir="auto"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[13px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-300" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                Generate Reading
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
