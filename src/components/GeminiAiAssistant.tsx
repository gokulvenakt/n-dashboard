import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  RotateCcw,
  User,
  ExternalLink,
  Minimize2,
  Maximize2,
  Mic,
} from 'lucide-react';
import { Finding } from '../types/findings';
import nevrixaLogo from '../assets/nevrixa-logo.png';

interface Message {
  id: string;
  sender: 'gemini' | 'user';
  text: string;
  timestamp: string;
  action?: {
    type: 'camera' | 'finding' | 'audit' | 'reconnect';
    label: string;
    payload?: any;
  };
  metrics?: { label: string; value: string; color?: string }[];
}

interface GeminiAiAssistantProps {
  findings?: Finding[];
  onNavigateToFindings?: () => void;
  onSelectFinding?: (finding: Finding) => void;
  onSelectCameraStream?: (cameraName: string) => void;
  onOpenAuditModal?: () => void;
  onTriggerReconnect?: (cameraName: string) => void;
}

export const GeminiAiAssistant: React.FC<GeminiAiAssistantProps> = ({
  findings = [],
  onNavigateToFindings,
  onSelectFinding,
  onSelectCameraStream,
  onOpenAuditModal,
  onTriggerReconnect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome conversation
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'gemini',
      text: "Hello Operator! I'm your **NEVRIXA Assistant**, continuously indexing 15 live camera streams and 20 operational findings across your 3 sites.\n\nHow can I help optimize your security and edge operations right now?",
      timestamp: 'Just now',
      metrics: [
        { label: 'Cameras', value: '15 Online', color: 'text-[#016D5D]' },
        { label: 'Autonomy', value: '70% Automated', color: 'text-[#059669]' },
        { label: 'Threats', value: '0 Critical Active', color: 'text-neutral-700' },
      ],
    },
  ]);

  const quickPrompts = [
    { label: '🚨 Summarize critical alerts', query: 'Summarize today\'s critical findings and security status' },
    { label: '📹 Which camera needs attention?', query: 'Which camera needs immediate attention or is unstable?' },
    { label: '📱 Why is phone use surging?', query: 'Why is phone use detection surging in Godown Line 2?' },
    { label: '⚡ Autonomy actions taken', query: 'What autonomy actions did Nevrixa execute without human intervention?' },
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isFullScreen, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, isFullScreen]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullScreen]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isThinking) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputText('');
    setIsThinking(true);

    // Simulate intelligent AI answer after brief reasoning delay
    setTimeout(() => {
      const q = textToSend.toLowerCase();
      let responseMessage: Message;

      if (q.includes('critical') || q.includes('alert') || q.includes('threat')) {
        responseMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 🚨 Critical Findings Summary\n\nAcross **3 monitored sites**, **2 critical security incidents** were detected today:\n\n1. **Perimeter Breach (Godown Line 2 - Cam 03)**\n   - **Time:** 10:14 AM\n   - **Detail:** Unauthorized personnel entered restricted loading dock without PPE.\n   - **Autonomy:** Audio deterrent broadcasted; security notified.\n\n2. **Fire Door Obstruction (Facility Main - Cam 07)**\n   - **Time:** 11:32 AM\n   - **Detail:** Pallets placed blocking Emergency Exit 4.\n\nBoth items have been assigned and are currently under verification. Zero unacknowledged critical threats remain.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'finding',
            label: 'Review Critical Findings Feed',
          },
          metrics: [
            { label: 'Criticals', value: '2 Recorded', color: 'text-red-600' },
            { label: 'Deterrence', value: '100% Executed', color: 'text-[#016D5D]' },
          ],
        };
      } else if (q.includes('camera') || q.includes('stream') || q.includes('offline') || q.includes('cam')) {
        responseMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 📹 Camera Fleet Diagnostic\n\n- **Total Monitored Streams:** 15 cameras across 3 locations.\n- **Status:** **15 / 15 Online** (100% operational uptime).\n- **Telemetry Notice:** **CAM-04 (Packing Bay 02)** experienced 2 dropped RTSP frames earlier at 09:42 AM due to switch bandwidth throttling.\n\nEdge telemetry has stabilized with latency sitting at **38ms**. Would you like to inspect the live RTSP stream for CAM-03 or test CAM-04?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'camera',
            label: 'Stream CAM-03 (Godown Line 2)',
            payload: 'CAM-03 (Godown Line 2)',
          },
          metrics: [
            { label: 'Fleet Health', value: '99.4%', color: 'text-[#059669]' },
            { label: 'Avg Latency', value: '38ms', color: 'text-[#016D5D]' },
          ],
        };
      } else if (q.includes('phone') || q.includes('godown') || q.includes('surge')) {
        responseMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 📱 Phone Usage Trend Analysis\n\n- **Surge Detected:** **9 findings (45% of total events)** are categorized as unauthorized mobile usage.\n- **Concentration:** 7 of 9 incidents originated from **Godown Line 2 (CAM-03)** between **09:30 AM and 11:00 AM** during pallet restacking shifts.\n- **Nevrixa Autonomous Action:** 5 micro-chimes triggered automatically on the floor speaker. No safety breaches occurred during phone interaction.\n\n**Recommendation:** Notify Floor Supervisor Rajesh at Godown regarding shift break adherence.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'camera',
            label: 'Open Godown CAM-03 Live Feed',
            payload: 'CAM-03 (Godown Line 2)',
          },
          metrics: [
            { label: 'Phone Events', value: '9 detections', color: 'text-amber-600' },
            { label: 'Godown Share', value: '78%', color: 'text-neutral-800' },
          ],
        };
      } else if (q.includes('autonomy') || q.includes('auto') || q.includes('action') || q.includes('handled')) {
        responseMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### ⚡ Autonomous Operations Breakdown\n\nToday NEVRIXA achieved a **70% Autonomous Operations Rate** across all 20 findings:\n\n- **Handled by Nevrixa:** **6 findings (30%)**\n  - Edge audio warning broadcasts triggered: 3\n  - Telegram / SMS dispatcher alerts sent: 2\n  - Access barrier held: 1\n- **Logged, No Action Needed:** **8 findings (40%)**\n  - Minor baseline motion & temporary shadow telemetry auto-triaged with zero operator distraction.\n- **Reviewed by a Person:** **6 findings (30%)**\n  - Escalated to human operator for supervisor confirmation.\n\nZero false alarms escalated to the main security team.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'audit',
            label: 'Inspect Automation Audit Log',
          },
          metrics: [
            { label: 'Autonomy Rate', value: '70%', color: 'text-[#016D5D]' },
            { label: 'Time Saved', value: '48 mins', color: 'text-[#059669]' },
          ],
        };
      } else {
        responseMessage = {
          id: `gemini-${Date.now()}`,
          sender: 'gemini',
          text: `### 🤖 Vision Telemetry Analysis\n\nBased on your query: *"${textToSend}"*\n\nI have correlated the telemetry across all active edge models:\n- **YOLOv8-Security:** Running at 30 FPS across 15 RTSP streams.\n- **Safety & PPE Detector:** 97.2% confidence baseline.\n- **Site Correlation:** Site Godown holds the highest activity index (60%), followed by Facility Main (30%) and Perimeter Yard (10%).\n\nAll edge inference nodes report normal thermal and GPU capacity. You can ask for specific camera diagnostics, audit details, or incident triage anytime.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: {
            type: 'finding',
            label: 'View Operational Feed',
          },
          metrics: [
            { label: 'Inference Status', value: 'Healthy (30 FPS)', color: 'text-[#016D5D]' },
            { label: 'Active Models', value: '4 Running', color: 'text-neutral-700' },
          ],
        };
      }

      setMessages((prev) => [...prev, responseMessage]);
      setIsThinking(false);
    }, 600);
  };

  const handleActionClick = (action: Message['action']) => {
    if (!action) return;
    if (action.type === 'camera' && action.payload && onSelectCameraStream) {
      onSelectCameraStream(action.payload);
    } else if (action.type === 'finding' && onNavigateToFindings) {
      onNavigateToFindings();
    } else if (action.type === 'audit' && onOpenAuditModal) {
      onOpenAuditModal();
    } else if (action.type === 'reconnect' && action.payload && onTriggerReconnect) {
      onTriggerReconnect(action.payload);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'gemini',
        text: "Conversation cleared. I'm ready to answer any operational questions regarding your live cameras, detections, or system telemetry.",
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* 
        ========================================================================
        AI ASSISTANT TRIGGER BUTTON (Pinned Right-Bottom of the page)
        High-clarity design with NEVRIXA Logo, explicit 'Ask AI Assistant' label,
        and high-visibility 'AI' badge
        ========================================================================
      */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center">
        {/* Floating Action Button with Clear AI Branding */}
        {isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="relative group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer border bg-neutral-900 text-white border-neutral-700 ring-4 ring-neutral-300/60 hover:bg-neutral-800"
            title="Close AI Assistant"
            aria-label="Close AI Assistant"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-white shrink-0">
              <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide font-sans">
              Close AI Assistant
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              if (isMinimized) setIsMinimized(false);
            }}
            className="relative group p-0 bg-transparent border-none cursor-pointer focus:outline-hidden transition-transform duration-300 active:scale-95"
            title="NEVRIXA AI Assistant - Click to ask about cameras, findings, and telemetry"
            aria-label="Open AI Assistant"
          >
            {/* Hover Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
              <div className="bg-neutral-950/95 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg shadow-xl border border-neutral-700/80 whitespace-nowrap flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
                <span>NEVRIXA AI Assistant</span>
              </div>
            </div>

            {/* AI Assistant: Sparkle Shape with Logo placed in center (Replacing Circle) */}
            <div className="relative w-16 h-16 flex items-center justify-center">


              {/* NEVRIXA Logo placed directly in the center of the Sparkle Shape */}
              <div className="absolute inset-0 m-auto w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center z-10 transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                <img
                  src={nevrixaLogo}
                  alt="NEVRIXA AI Assistant"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 
        ========================================================================
        AI ASSISTANTS BOX (Floating Window or Full Screen View)
        ========================================================================
      */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out flex flex-col bg-white/98 backdrop-blur-2xl border border-neutral-200/90 shadow-2xl overflow-hidden ${isFullScreen
            ? 'inset-2 sm:inset-4 md:inset-6 rounded-2xl w-auto h-auto max-w-none max-h-none'
            : isMinimized
              ? 'bottom-24 right-6 w-80 h-14 rounded-2xl'
              : 'bottom-24 right-6 w-[440px] max-w-[calc(100vw-2rem)] h-[630px] max-h-[82vh] rounded-2xl'
            }`}
          style={{
            boxShadow: isFullScreen
              ? '0 25px 60px -15px rgba(1, 109, 93, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.1)'
              : '0 25px 50px -12px rgba(1, 109, 93, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >


          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-neutral-50 via-white to-[#F0FAF8] border-b border-neutral-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Header Logo with AI Sparkle Icon Background */}
              <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  className="absolute w-8 h-8 text-[#00E9C9] fill-[#00E9C9]/30 drop-shadow-[0_0_6px_rgba(0,233,201,0.6)]"
                >
                  <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
                </svg>
                <img
                  src={nevrixaLogo}
                  alt="NEVRIXA"
                  className="relative z-10 w-6 h-6 rounded-md object-contain shadow-xs border border-white/80 bg-[#016D5D]"
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-neutral-900 tracking-tight">
                    NEVRIXA AI Assistant
                  </h3>
                </div>
                <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>15 Cameras Connected · Live</span>
                </div>
              </div>
            </div>

            {/* Window Controls: Full Screen, Reset, Minimize, Close */}
            <div className="flex items-center gap-1.5 text-neutral-500">
              {/* View Full Screen Toggle Option */}
              <button
                type="button"
                onClick={() => {
                  setIsFullScreen(!isFullScreen);
                  if (isMinimized) setIsMinimized(false);
                }}
                className={`px-2 py-1 flex items-center gap-1.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer border shadow-2xs ${isFullScreen
                  ? 'bg-[#016D5D] text-white border-[#016D5D]'
                  : 'bg-white text-neutral-700 hover:text-[#016D5D] hover:bg-[#E6F4F1] border-neutral-200/80'
                  }`}
                title={isFullScreen ? 'Exit Full Screen' : 'View Full Screen'}
              >
                {isFullScreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline font-mono">Exit Full Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-[#016D5D]" />

                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {!isFullScreen && (
                <button
                  type="button"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                  title={isMinimized ? 'Expand' : 'Minimize'}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsFullScreen(false);
                }}
                className="p-1.5 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* When not minimized, display chat messages & input */}
          {!isMinimized && (
            <>
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans">
                <div className={isFullScreen ? 'max-w-4xl mx-auto w-full space-y-4' : 'space-y-4'}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'
                        } animate-in fade-in duration-200`}
                    >
                      {/* Message Bubble Container */}
                      <div className="flex items-start gap-2.5 max-w-[90%] sm:max-w-[85%]">
                        {/* Assistant Reply Icon: Using NEVRIXA Logo with AI Sparkle Background */}
                        {msg.sender === 'gemini' && (
                          <div className="relative w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                            <svg
                              viewBox="0 0 24 24"
                              className="absolute w-7 h-7 text-[#00E9C9] fill-[#00E9C9]/25"
                            >
                              <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
                            </svg>
                            <img
                              src={nevrixaLogo}
                              alt="NEVRIXA AI"
                              className="relative z-10 w-5 h-5 rounded-xs object-contain shadow-2xs border border-white/80 bg-[#016D5D]"
                            />
                          </div>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-[#016D5D] to-[#01584B] text-white rounded-br-xs shadow-sm font-medium'
                            : 'bg-white border border-neutral-200/90 text-neutral-800 rounded-bl-xs shadow-2xs'
                            }`}
                        >
                          {/* Text rendering with basic markdown support */}
                          <div className="space-y-2 whitespace-pre-wrap leading-relaxed text-xs sm:text-[13px]">
                            {msg.text.split('\n\n').map((paragraph, idx) => {
                              if (paragraph.startsWith('### ')) {
                                return (
                                  <h4 key={idx} className="font-bold text-neutral-950 text-xs sm:text-sm mt-1">
                                    {paragraph.replace('### ', '')}
                                  </h4>
                                );
                              }
                              return (
                                <p key={idx} className="leading-relaxed">
                                  {paragraph}
                                </p>
                              );
                            })}
                          </div>

                          {/* Optional Metric Chips */}
                          {msg.metrics && msg.metrics.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-neutral-100">
                              {msg.metrics.map((m, i) => (
                                <div
                                  key={i}
                                  className="px-2 py-0.5 rounded bg-neutral-50 border border-neutral-200 text-[10px] font-mono font-medium flex items-center gap-1.5"
                                >
                                  <span className="text-neutral-500">{m.label}:</span>
                                  <span className={`font-bold ${m.color || 'text-neutral-900'}`}>{m.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Direct Action Button */}
                          {msg.action && (
                            <div className="mt-3 pt-2 border-t border-neutral-100">
                              <button
                                type="button"
                                onClick={() => handleActionClick(msg.action)}
                                className="w-full py-1.5 px-3 rounded-lg bg-[#E6F4F1] hover:bg-[#D5EFEA] text-[#016D5D] font-semibold text-[11px] flex items-center justify-between transition-colors cursor-pointer border border-[#016D5D]/20 shadow-2xs group"
                              >
                                <span>{msg.action.label}</span>
                                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          )}
                        </div>

                        {msg.sender === 'user' && (
                          <div className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* Time indicator */}
                      <span className="text-[10px] text-neutral-400 font-mono mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Thinking / Reasoning State with NEVRIXA Logo and Rotating AI Sparkle */}
                  {isThinking && (
                    <div className="flex items-start gap-2.5 max-w-[85%] animate-in fade-in">
                      <div className="relative w-7 h-7 flex items-center justify-center shrink-0 mt-0.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="absolute w-7 h-7 text-[#00E9C9] fill-[#00E9C9]/40 animate-spin [animation-duration:4s]"
                        >
                          <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
                        </svg>
                        <img
                          src={nevrixaLogo}
                          alt="NEVRIXA AI"
                          className="relative z-10 w-5 h-5 rounded-xs object-contain shadow-2xs border border-white/80 bg-[#016D5D] animate-pulse"
                        />
                      </div>
                      <div className="p-3 bg-white border border-neutral-200/90 rounded-2xl rounded-bl-xs shadow-2xs flex items-center gap-2 text-xs text-neutral-500 font-mono">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#016D5D] animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00E9C9] animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span>NEVRIXA AI is reasoning over telemetry...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Quick Prompt Recommendation Chips */}
              <div className="px-3 sm:px-6 py-2 bg-neutral-50/80 border-t border-neutral-100 shrink-0">
                <div className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none ${isFullScreen ? 'max-w-4xl mx-auto w-full' : ''}`}>
                  {quickPrompts.map((chip, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSendMessage(chip.query)}
                      className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-[#E6F4F1] text-neutral-700 hover:text-[#016D5D] border border-neutral-200/80 hover:border-[#016D5D]/30 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 bg-white border-t border-neutral-200/80 shrink-0">
                <div className={isFullScreen ? 'max-w-4xl mx-auto w-full' : ''}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2 bg-[#F8FAFB] focus-within:bg-white border border-neutral-200 focus-within:border-[#016D5D] focus-within:ring-2 focus-within:ring-[#016D5D]/20 rounded-xl px-3 py-2 transition-all shadow-inner"
                  >
                    <Sparkles className="w-4 h-4 text-[#016D5D] shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask Nevrixa AI Assistant about cameras, alerts, or telemetry..."
                      className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none font-sans"
                    />
                    <div className="flex items-center gap-1 text-neutral-400">
                      <button
                        type="button"
                        onClick={() => handleSendMessage("Run full edge security audit for today's findings")}
                        className="p-1 hover:text-[#016D5D] transition-colors cursor-pointer"
                        title="Run full diagnostic"
                      >
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="submit"
                        disabled={!inputText.trim() || isThinking}
                        className={`p-1.5 rounded-lg text-white transition-all cursor-pointer ${inputText.trim() && !isThinking
                          ? 'bg-gradient-to-r from-[#016D5D] to-[#00E9C9] hover:opacity-90 shadow-2xs'
                          : 'bg-neutral-300 cursor-not-allowed opacity-60'
                          }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                  <div className="text-[10px] text-neutral-400 text-center mt-1.5 font-mono">
                    Grounded in real-time camera metadata & audit logs
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
