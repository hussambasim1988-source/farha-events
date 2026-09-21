import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Palette, 
  PlusCircle, 
  HelpCircle, 
  Loader2, 
  User 
} from 'lucide-react';
import { FarhaAIChatMessage, EventCategory } from '../types';

interface FarhaAIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (cat: EventCategory) => void;
}

const INITIAL_MESSAGES: FarhaAIChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `أهلاً بك يا طيب في منصة "فرحة"! 🎈✨\nأنا مستشارك الذكي لتنسيق المناسبات في العراق.\n\nيمكنني مساعدتك في:\n1. اقتراح أفكار ثيمات مبهجة وتناسق ألوان للأطفال والكبار.\n2. التخطيط لحفلات التخرج أو الختان (الطهور) أو تزيين سيارات الأعراس.\n3. اختيار أفضل باقة تناسب ميزانيتك بالدينار العراقي.\n\nعن ماذا تود الاستفسار اليوم؟`,
    timestamp: 'الآن',
    suggestedActions: [
      { label: 'أريد فكرة ثيم لعيد ميلاد طفل عمره 3 سنوات', actionType: 'ask_question' },
      { label: 'ما هو أجمل ديكور لحفل تخرج في البيت؟', actionType: 'ask_question' },
      { label: 'كيف أزين سيارة العرس بورد طبيعي بدون ما يتأثر الصبغ؟', actionType: 'ask_question' },
      { label: 'شنو التجهيزات المطلوبة لحفلة طهور تراثية؟', actionType: 'ask_question' },
    ]
  }
];

export const FarhaAIAssistantModal: React.FC<FarhaAIAssistantModalProps> = ({
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<FarhaAIChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMsg: FarhaAIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: 'الآن'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/farha/event-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMsg: FarhaAIChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: 'الآن',
          suggestedActions: data.suggestedQuestions?.map((q: string) => ({
            label: q,
            actionType: 'ask_question'
          }))
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error(data.error || 'حدث خطأ');
      }
    } catch (err) {
      // Fallback message
      const fallbackMsg: FarhaAIChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `أهلاً بك! لتنظيم هذه المناسبة بأجمل صورة في العراق:\n- ننصحك باختيار ألوان متناسقة مع كوشة وإضاءة دافئة.\n- فريق "فرحة" يتولى كافة أعمال التركيب الموقعي مع ضمان الجودة.\n- يمكنك تصفح الباقات أو فتح حاسبة التكلفة لتحديد خياراتك وسنقوم بالتنفيذ فوراً!`,
        timestamp: 'الآن'
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 via-indigo-600 to-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">مستشار فرحة الذكي للمناسبات</h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                  AI
                </span>
              </div>
              <p className="text-xs text-purple-200">أفكار إبداعية وتنسيق ألوان وميزانيات للحفلات</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser 
                    ? 'bg-rose-600 text-white' 
                    : 'bg-purple-600 text-white shadow-xs'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-rose-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                  {/* Suggested actions if present */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(action.label)}
                          className="text-[11px] px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 transition-colors text-right cursor-pointer"
                        >
                          💡 {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-purple-600 text-xs font-bold bg-purple-50 p-3 rounded-2xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>مستشار فرحة يفكر ويجهز لك أجمل الأفكار...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="اكتب سؤالك، مثلاً: ما هي أفضل ألوان لعيد ميلاد بنوتة؟"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 focus:outline-purple-600 text-slate-800"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
