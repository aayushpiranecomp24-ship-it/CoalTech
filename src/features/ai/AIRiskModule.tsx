// COALTECH - AI Risk Intelligence & Regulatory Assistant Module
import React, { useState } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import {
  BrainCircuit,
  Bot,
  Search,
  BookOpen,
  Send,
  CheckCircle,
} from 'lucide-react';

export const AIRiskModule: React.FC = () => {
  const { queryAiAssistant, queryRegulatoryRAG } = useGovernance();
  const { t } = useI18n();

  // Assistant state
  const [chatInput, setChatInput] = useState('');
  const [chatLogs, setChatLogs] = useState<{ sender: 'user' | 'ai'; text: string; data?: any[] }[]>([
    {
      sender: 'ai',
      text: 'Greetings. I am the CoalTech Statutory Intelligence Assistant. Ask me anything regarding mine hazard levels, overdue corrective actions, transportation discrepancies, or vendor risk scores.',
    },
  ]);

  // RAG Search State
  const [ragQuery, setRagQuery] = useState('methane concentration CMR 169');
  const [ragResult, setRagResult] = useState<{ answer: string; citation: string; date: string } | null>(null);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatLogs((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      const res = queryAiAssistant(userMsg);
      setChatLogs((prev) => [...prev, { sender: 'ai', text: res.answer, data: res.data }]);
    }, 400);
  };

  const handleRagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;
    const res = queryRegulatoryRAG(ragQuery);
    setRagResult(res);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <BrainCircuit className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('nav_ai', 'AI Risk Intelligence & Rule Engine Architecture')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Predictive multi-factor risk scoring combined with deterministic statutory rule enforcement (CMR 2017 & DGMS).
        </p>
      </div>

      {/* Visual Architectural Pipeline Banner: DATA → AI → INSIGHT → RULE ENGINE → ESCALATION */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Pipeline Architecture: Statistical AI vs. Deterministic Statutory Rule Engine
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Zero Hallucination Assurance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1: DATA */}
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-sky-400 uppercase">1. Field Data Layer</span>
            <div className="font-bold text-xs text-slate-100">Telemetry & Audits</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              IoT sensors (CH4, Dust, pH), worker hazard reports, inspector sweeps, and contractor logs.
            </p>
          </div>

          {/* Step 2: AI ANALYSIS */}
          <div className="bg-slate-900 border border-purple-800/60 p-3.5 rounded-xl space-y-1.5 border-t-2 border-t-purple-500">
            <span className="text-[10px] font-bold text-purple-400 uppercase">2. AI Risk Engine</span>
            <div className="font-bold text-xs text-slate-100">Multi-factor Scoring</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Calculates 0-100 score weighing Severity (30%), Recurrence (20%), Overdue SLA (15%), Location (15%).
            </p>
          </div>

          {/* Step 3: RISK INSIGHT */}
          <div className="bg-slate-900 border border-amber-800/60 p-3.5 rounded-xl space-y-1.5 border-t-2 border-t-amber-500">
            <span className="text-[10px] font-bold text-amber-400 uppercase">3. Risk Insights</span>
            <div className="font-bold text-xs text-slate-100">Anomaly Cluster</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Identifies recurring violation patterns, sub-surface gas spikes, and contractor breach clusters.
            </p>
          </div>

          {/* Step 4: RULE ENGINE */}
          <div className="bg-slate-900 border border-emerald-800/60 p-3.5 rounded-xl space-y-1.5 border-t-2 border-t-emerald-500">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">4. Statutory Rules</span>
            <div className="font-bold text-xs text-slate-100">Deterministic Engine</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Enforces statutory CMR 2017 SLA limits, prevents inspector self-approval, locks contractor payments.
            </p>
          </div>

          {/* Step 5: ESCALATION */}
          <div className="bg-slate-900 border border-rose-800/60 p-3.5 rounded-xl space-y-1.5 border-t-2 border-t-rose-500">
            <span className="text-[10px] font-bold text-rose-400 uppercase">5. Enforcement</span>
            <div className="font-bold text-xs text-slate-100">Alerts & Blockchain</div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Dispatches multi-channel alerts (SMS, Voice, App) and anchors transactions in tamper-evident ledger.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: AI Conversational Assistant & Regulatory RAG */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Statutory AI Q&A Assistant */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <Bot className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Factual Governance Assistant</h3>
                <p className="text-[10px] text-slate-400">Context-aware Q&A querying active relational tables</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="overflow-y-auto max-h-[300px] space-y-2.5 pr-2 text-xs">
              {chatLogs.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-sky-600 text-white font-medium'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.data && msg.data.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-300 dark:border-slate-700 text-[10px]">
                        <span className="font-bold block mb-1">Associated Records:</span>
                        {msg.data.slice(0, 3).map((d, idx) => (
                          <div key={idx} className="font-mono text-sky-600 dark:text-sky-400">
                            • {d.title || d.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleChatSubmit} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask: 'Which mines have critical violations?' or 'Why is Mine A high risk?'..."
              className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Panel 2: Regulatory RAG Knowledge Lookup */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Regulatory RAG Semantic Search</h3>
                <p className="text-[10px] text-slate-400">Statutory lookup across CMR 2017 & DGMS Safety Circulars</p>
              </div>
            </div>

            <form onSubmit={handleRagSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Search: methane, coal dust, roof bolting, barrier height..."
                className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5 mr-1" /> Look Up
              </button>
            </form>

            {ragResult ? (
              <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  <CheckCircle className="w-4 h-4" />
                  <span>Statutory Citation: {ragResult.citation}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{ragResult.answer}</p>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                  Statutory Effect Date: {ragResult.date}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2 text-xs">
                <BookOpen className="w-8 h-8 mx-auto opacity-30 text-emerald-500" />
                <p>Enter any mining statutory topic to extract verified legal citations.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-800 dark:text-emerald-300">
            <strong>Grounding Guarantee:</strong> Responses are grounded in official Directorate General of Mines Safety publications and Coal Mines Regulations 2017.
          </div>
        </div>
      </div>
    </div>
  );
};
