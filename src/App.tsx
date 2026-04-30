import React, { useState, useEffect } from 'react';
import { Form } from './components/Form';
import { ContentView } from './components/ContentView';
import { Sidebar } from './components/Sidebar';
import { generateGermanReading } from './lib/gemini';
import { loadHistory, saveToHistory, deleteFromHistory } from './lib/storage';
import { GeneratedContent, Level, ContentType } from './types';
import { Menu, BookOpenText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // To re-run generation we need the last inputs
  const [lastInputs, setLastInputs] = useState<{level: Level, type: ContentType, topic: string} | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleGenerate = async (level: Level, type: ContentType, topic: string) => {
    setIsLoading(true);
    setError(null);
    setLastInputs({ level, type, topic });
    
    try {
      const result = await generateGermanReading(level, type, topic);
      const newContent: GeneratedContent = {
        ...result,
        level,
        contentType: type,
        topic,
        createdAt: Date.now(),
        id: crypto.randomUUID()
      };
      
      setCurrentContent(newContent);
      saveToHistory(newContent);
      setHistory(loadHistory());
      setLastInputs(null); // Hide form after successful generation
      
      // on mobile, close sidebar if open
      setIsSidebarOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setLastInputs(null); // allow form to be re-attempted
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (currentContent) {
       handleGenerate(currentContent.level, currentContent.contentType, currentContent.topic);
    }
  };

  const startNew = () => {
    setCurrentContent(null);
    setLastInputs(null);
    setError(null);
  };

  const handleDeleteHistory = (id: string) => {
    deleteFromHistory(id);
    setHistory(loadHistory());
    if (currentContent?.id === id) {
      setCurrentContent(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        history={history}
        onSelect={(item) => {
          setCurrentContent(item);
          setError(null);
          setIsSidebarOpen(false);
        }}
        onDelete={handleDeleteHistory}
        isLoading={isLoading}
      />
      
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="flex-none bg-white/70 backdrop-blur-xl border-b border-white/60 sticky top-0 z-30 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={startNew}
              >
                <div className="bg-indigo-600 p-1.5 rounded-md shadow-sm">
                  <BookOpenText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-base tracking-tight text-slate-800 leading-none">Lesen Deutsch</h1>
                  <span className="text-[9px] text-slate-500 font-medium font-sans" dir="rtl">تعلم القراءة بالألمانية بطريقة ذكية</span>
                </div>
              </div>
            </div>
            
            {currentContent && (
              <button 
                onClick={startNew}
                className="text-[12px] font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                New Text
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-20">
            
            <AnimatePresence mode="wait">
              {!currentContent && !isLoading && !error && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6"
                >
                  <div className="text-center mb-6 mt-4">
                    <h2 className="text-xl md:text-2xl font-serif italic text-slate-800 mb-2">
                      Master German Reading
                    </h2>
                    <p className="text-[13px] text-slate-500 max-w-sm mx-auto" dir="rtl">
                      اختر المستوى ونوع النص، وسنقوم بتوليد محتوى مناسب لمستواك مع الترجمة والمفردات المهمة.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show Form only when creating a new prompt */}
            {!currentContent && (
              <Form onGenerate={handleGenerate} isLoading={isLoading} />
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-8 flex items-center justify-center font-medium shadow-sm"
                dir="rtl"
              >
                {error}
              </motion.div>
            )}

            {currentContent && !error && (
              <ContentView 
                content={currentContent} 
                onRegenerate={handleRegenerate} 
                isLoading={isLoading} 
              />
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
