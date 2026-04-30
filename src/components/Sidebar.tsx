import React from 'react';
import { GeneratedContent } from '../types';
import { BookOpen, Clock, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedContent[];
  onSelect: (item: GeneratedContent) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export function Sidebar({ isOpen, onClose, history, onSelect, onDelete, isLoading }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white/90 backdrop-blur-3xl border-r border-white/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)] lg:static lg:translate-x-0 lg:shadow-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">History / السجل</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-65px)] p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No history yet.</p>
              <p className="text-sm" dir="rtl">لم تقم بتوليد أي نصوص بعد.</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-white/50 border border-slate-100/60 p-3 rounded-xl cursor-pointer hover:border-indigo-200/60 hover:bg-white hover:shadow-sm transition-all duration-300"
              >
                <div 
                  onClick={() => {
                    if (!isLoading) {
                      onSelect(item);
                      onClose();
                    }
                  }}
                  className="pr-8"
                >
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-1 mb-2">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
                    <span className="px-1.5 py-0.5 rounded bg-indigo-50/50 text-indigo-600">{item.level}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50/50 text-amber-600">{item.contentType}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className="absolute right-2 top-2 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
