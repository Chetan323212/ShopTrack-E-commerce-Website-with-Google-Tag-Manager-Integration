import React, { useState, useEffect } from "react";
import { Activity, ChevronDown, ChevronUp, Trash2, Copy, Check } from "lucide-react";

export const DataLayerInspector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const handleEvent = (e) => {
      setEvents((prev) => [e.detail, ...prev.slice(0, 19)]);
    };

    window.addEventListener("aura:datalayer", handleEvent);
    return () => window.removeEventListener("aura:datalayer", handleEvent);
  }, []);

  const copyEvent = (eventData, index) => {
    navigator.clipboard.writeText(JSON.stringify(eventData, null, 2));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      id="datalayer-inspector"
      aria-label="GTM and GA4 Live Events Inspector"
      className="fixed bottom-4 left-4 z-40 font-mono text-xs max-w-sm w-full transition-all"
    >
      <div className="glass-panel border border-brand-500/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Header Pill */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 hover:bg-slate-800/90 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Activity className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-slate-200 tracking-wide font-sans">
              GA4 / GTM Live dataLayer
            </span>
            <span className="bg-brand-500/20 text-brand-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {events.length}
            </span>
          </div>

          <div className="text-slate-400">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Expandable Inspector Body */}
        {isOpen && (
          <div className="p-3 bg-slate-950/95 max-h-80 overflow-y-auto space-y-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-[11px] text-slate-400 font-sans">
              <span>Real-time Ecommerce Telemetry</span>
              {events.length > 0 && (
                <button
                  onClick={() => setEvents([])}
                  className="flex items-center gap-1 hover:text-rose-400 transition"
                  title="Clear events"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            {events.length === 0 ? (
              <div className="py-6 text-center text-slate-500 font-sans text-xs">
                Interact with the store (search, filter, view, add to cart) to see live dataLayer pushes.
              </div>
            ) : (
              events.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold text-xs tracking-wider">
                      event: "{ev.event}"
                    </span>
                    <button
                      onClick={() => copyEvent(ev, idx)}
                      className="text-slate-400 hover:text-slate-200 p-1"
                      title="Copy payload"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <pre className="text-[10px] text-slate-300 overflow-x-auto p-1.5 bg-black/40 rounded border border-white/5 max-h-36">
                    {JSON.stringify(ev.ecommerce || ev, null, 2)}
                  </pre>
                  <div className="text-[9px] text-slate-500 mt-1 text-right">
                    {new Date(ev._timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
