import React, { useState, useEffect } from 'react';
import { GeneratedContent } from '../types';
import { Copy, Check, EyeOff, Eye, RefreshCw, Languages, BookA, Volume2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContentViewProps {
  content: GeneratedContent;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function ContentView({ content, onRegenerate, isLoading }: ContentViewProps) {
  const [showTranslation, setShowTranslation] = useState(true);
  const [showVocab, setShowVocab] = useState(true);
  const [copiedGerman, setCopiedGerman] = useState(false);
  const [copiedArabic, setCopiedArabic] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const copyToClipboard = async (text: string, setter: (val: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      setTimeout(() => setter(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(content.germanText);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9; // Slightly slower for language learners
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  if (!content && !isLoading) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-white/80 backdrop-blur border border-indigo-100/50 shadow-sm text-indigo-600 font-bold text-[10px] tracking-wider uppercase">
            {content.level}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/80 backdrop-blur border border-amber-100/50 shadow-sm text-amber-600 font-bold text-[10px] tracking-wider uppercase">
            {content.contentType}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${showTranslation ? 'bg-slate-800 text-white shadow-sm' : 'bg-white/80 text-slate-500 border border-slate-200/50 hover:bg-slate-50'}`}
          >
            {showTranslation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            Translation
          </button>
          <button
            onClick={() => setShowVocab(!showVocab)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${showVocab ? 'bg-slate-800 text-white shadow-sm' : 'bg-white/80 text-slate-500 border border-slate-200/50 hover:bg-slate-50'}`}
          >
            <BookA className="w-3 h-3" />
            Vocab
          </button>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50/50 text-indigo-600 border border-indigo-100/50 hover:bg-indigo-100 transition-all text-[11px] font-medium disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* German Text Column */}
        <div className="bg-white/90 backdrop-blur-xl rounded-xl p-5 md:p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-white/60 relative group min-h-[200px]">
          <div className="flex justify-between items-start mb-4 gap-2">
            <h2 className="text-lg md:text-xl font-serif text-slate-800 leading-snug">{content.title}</h2>
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleSpeech}
                className={`p-1.5 border rounded-md transition-colors shadow-sm ${isPlaying ? 'bg-amber-100 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 text-slate-500 hover:text-indigo-600'}`}
                title="Listen"
              >
                {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => copyToClipboard(content.germanText, setCopiedGerman)}
                className="p-1.5 bg-slate-50 border border-slate-100 hover:bg-white text-slate-400 hover:text-slate-600 rounded-md transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm"
                title="Copy text"
              >
                {copiedGerman ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div className="prose prose-slate prose-sm max-w-none text-slate-700 leading-relaxed text-[14px]">
            {content.germanText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-3 last:mb-0">{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Arabic Translation Column */}
        <AnimatePresence>
          {showTranslation && (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, width: 0 }}
              className="bg-indigo-50/30 backdrop-blur-xl rounded-xl p-5 md:p-6 border border-indigo-100/40 shadow-[0_2px_12px_rgb(0,0,0,0.02)] relative group"
              dir="rtl"
            >
              <div className="flex justify-between items-start mb-4 border-b border-indigo-100/50 pb-3">
                <div className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-indigo-400" />
                  <h2 className="text-sm font-bold text-slate-700 font-sans tracking-wide">الترجمة</h2>
                </div>
                <button 
                  onClick={() => copyToClipboard(content.arabicTranslation, setCopiedArabic)}
                  className="p-1.5 bg-white border border-indigo-50 hover:bg-slate-50 text-indigo-300 hover:text-indigo-500 rounded-md transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  {copiedArabic ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-sans text-[13px]">
                {content.arabicTranslation.split('\n\n').map((paragraph, idx) => (
                   <p key={idx} className="mb-3 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vocabulary Section */}
      <AnimatePresence>
        {showVocab && content.vocabulary && content.vocabulary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15, height: 0 }}
            className="bg-white/90 backdrop-blur-xl rounded-xl p-5 md:p-6 shadow-[0_2px_12px_rgb(0,0,0,0.03)] border border-white/60 mt-4"
          >
             <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
               <BookA className="w-4 h-4 text-amber-500" />
               <h2 className="text-base font-serif text-slate-800">Vocabulary <span className="text-slate-400 font-sans mx-1.5">|</span> <span dir="rtl" className="font-sans text-[13px] font-bold text-slate-600 tracking-wide">المفردات</span></h2>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-3">
                {content.vocabulary.map((vocab, index) => (
                  <div key={index} className="flex flex-col p-3 rounded-lg bg-slate-50/50 border border-slate-100/80 group hover:border-amber-200 hover:bg-white hover:shadow-sm transition-all duration-300">
                     <div className="flex justify-between items-start mb-1.5">
                       <span className="font-bold text-[14px] text-slate-800">{vocab.german}</span>
                       <span className="font-semibold text-indigo-600 font-sans text-[13px]" dir="rtl">{vocab.arabicMeaning}</span>
                     </div>
                     <div className="mt-1 pt-2 border-t border-slate-200/50 flex flex-col gap-1">
                       <span className="text-[12px] text-slate-600 bg-white border border-slate-100 px-1.5 py-0.5 rounded inline-block w-fit">
                         "{vocab.exampleGerman}"
                       </span>
                       <span className="text-[12px] text-slate-500 font-sans" dir="rtl">
                         {vocab.exampleArabic}
                       </span>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
