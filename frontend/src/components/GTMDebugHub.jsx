import React, { useState, useEffect } from "react";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Check,
  Radio,
  Settings,
  Download,
  Play,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  getTrackingConfig,
  setTrackingConfig,
  pushDataLayer,
  trackViewItem,
  trackAddToCart,
  trackPurchase,
} from "../utils/gtm";
import { SAMPLE_PRODUCTS } from "../data/products";

export const GTMDebugHub = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline"); // 'timeline' | 'preview' | 'config'
  const [events, setEvents] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  // Configuration state
  const config = getTrackingConfig();
  const [gtmIdInput, setGtmIdInput] = useState(config.gtmId);
  const [ga4IdInput, setGa4IdInput] = useState(config.ga4Id);
  const [debugMode, setDebugMode] = useState(config.isDebugMode);
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    const handleEvent = (e) => {
      setEvents((prev) => [e.detail, ...prev.slice(0, 49)]);
    };

    window.addEventListener("aura:datalayer", handleEvent);
    return () => window.removeEventListener("aura:datalayer", handleEvent);
  }, []);

  const copyPayload = (payload, id) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setTrackingConfig(gtmIdInput, ga4IdInput, debugMode);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const exportDataLayerJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_gtm_datalayer_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Test Simulation Triggers
  const simulateViewItem = () => {
    const sample = SAMPLE_PRODUCTS[0];
    trackViewItem(sample);
  };

  const simulateAddToCart = () => {
    const sample = SAMPLE_PRODUCTS[1];
    trackAddToCart(sample, 1, sample.colors ? sample.colors[0] : "");
  };

  const simulatePurchase = () => {
    const sample = SAMPLE_PRODUCTS[0];
    const orderId = `TEST-${Math.floor(100000 + Math.random() * 900000)}`;
    trackPurchase(orderId, [{ product: sample, quantity: 1 }], sample.price, 12, 0, "AURA20");
  };

  return (
    <aside
      id="gtm-ga4-debug-hub"
      aria-label="Google Tag Manager and GA4 Telemetry Hub"
      className="fixed bottom-4 left-4 z-40 font-mono text-xs max-w-md w-full transition-all"
    >
      <div className="glass-panel border border-brand-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Hub Title Pill Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/95 hover:bg-slate-800/90 transition text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Radio className="w-4 h-4 text-brand-400" />
            <span className="font-semibold text-white tracking-wide font-sans text-xs">
              GTM & GA4 Debug Hub
            </span>
            <span className="bg-brand-500/20 text-brand-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {events.length} Events
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">
              DebugView: ON
            </span>
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {/* Hub Body Panel */}
        {isOpen && (
          <div className="bg-slate-950/98 border-t border-slate-800 flex flex-col max-h-96">
            {/* Sub-Tabs Navigation */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800 text-[11px] font-sans">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === "timeline"
                      ? "bg-brand-600 text-white shadow-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  GA4 DebugView ({events.length})
                </button>
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-brand-600 text-white shadow-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  GTM Preview
                </button>
                <button
                  onClick={() => setActiveTab("config")}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${
                    activeTab === "config"
                      ? "bg-brand-600 text-white shadow-glow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ID Settings
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1 text-slate-400">
                {events.length > 0 && (
                  <>
                    <button
                      onClick={exportDataLayerJSON}
                      className="p-1 hover:text-white transition"
                      title="Export dataLayer to JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEvents([])}
                      className="p-1 hover:text-rose-400 transition"
                      title="Clear events"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* TAB 1: GA4 DebugView Event Stream */}
            {activeTab === "timeline" && (
              <div className="p-3 overflow-y-auto space-y-2 flex-1">
                {events.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 font-sans text-xs space-y-2">
                    <p>No telemetry events captured yet.</p>
                    <p className="text-[11px] text-slate-600">
                      Interact with the store or trigger quick simulations below:
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                      <button
                        onClick={simulateViewItem}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
                      >
                        + view_item
                      </button>
                      <button
                        onClick={simulateAddToCart}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white"
                      >
                        + add_to_cart
                      </button>
                      <button
                        onClick={simulatePurchase}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 hover:text-emerald-300"
                      >
                        + purchase
                      </button>
                    </div>
                  </div>
                ) : (
                  events.map((ev, idx) => {
                    const isValid = ev._validation?.isValid !== false;
                    const itemsCount = ev.ecommerce?.items?.length || 0;

                    return (
                      <div
                        key={ev._eventId || idx}
                        className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span className="text-emerald-400 font-bold text-xs tracking-wider">
                              {ev.event}
                            </span>
                            {itemsCount > 0 && (
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-sans">
                                {itemsCount} {itemsCount === 1 ? "item" : "items"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-sans font-bold flex items-center gap-1 ${
                                isValid
                                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {isValid ? <ShieldCheck className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                              {isValid ? "GA4 Valid" : "Check Schema"}
                            </span>

                            <button
                              onClick={() => copyPayload(ev, ev._eventId || idx)}
                              className="text-slate-400 hover:text-white p-1"
                              title="Copy JSON Payload"
                            >
                              {copiedId === (ev._eventId || idx) ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Payload Preview */}
                        <pre className="text-[10px] text-slate-300 overflow-x-auto p-2 bg-black/50 rounded-lg border border-white/5 max-h-36">
                          {JSON.stringify(ev.ecommerce || ev, null, 2)}
                        </pre>

                        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-sans">
                          <span>debug_mode: true</span>
                          <span>{new Date(ev._timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: GTM Preview Mode Assistant */}
            {activeTab === "preview" && (
              <div className="p-4 space-y-3 font-sans text-xs flex-1 overflow-y-auto">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">GTM Container Status</span>
                    <span className="text-[11px] font-mono text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                      {gtmIdInput}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">GA4 Measurement ID</span>
                    <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                      {ga4IdInput}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">
                    How to verify in GTM Preview & GA4:
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                    <li>
                      Open{" "}
                      <a
                        href="https://tagassistant.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-400 underline inline-flex items-center gap-0.5"
                      >
                        Tag Assistant <ExternalLink className="w-2.5 h-2.5" />
                      </a>{" "}
                      and paste your store URL (<code className="text-white">http://localhost:5173</code>).
                    </li>
                    <li>
                      In Google Tag Manager, click <strong>Preview</strong> with container <code className="text-brand-300">{gtmIdInput}</code>.
                    </li>
                    <li>
                      In Google Analytics 4, open <strong>Admin &gt; DebugView</strong> to watch e-commerce events stream in real-time.
                    </li>
                  </ol>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Instant Event Dispatchers (Test Suite)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={simulateViewItem}
                      className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 text-brand-400" />
                      <span>view_item</span>
                    </button>
                    <button
                      onClick={simulateAddToCart}
                      className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 text-brand-400" />
                      <span>add_to_cart</span>
                    </button>
                    <button
                      onClick={simulatePurchase}
                      className="py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Play className="w-2.5 h-2.5 text-emerald-400" />
                      <span>purchase</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Configuration & Custom IDs */}
            {activeTab === "config" && (
              <form onSubmit={handleSaveConfig} className="p-4 space-y-3 font-sans text-xs flex-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Google Tag Manager Container ID
                  </label>
                  <input
                    type="text"
                    value={gtmIdInput}
                    onChange={(e) => setGtmIdInput(e.target.value)}
                    placeholder="GTM-XXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Default demo container: <code className="text-slate-400">GTM-AURA99X</code>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 block">
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    value={ga4IdInput}
                    onChange={(e) => setGa4IdInput(e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Default demo measurement ID: <code className="text-slate-400">G-AURA99TEST</code>
                  </p>
                </div>

                <div className="pt-1">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs text-slate-300 font-semibold">
                      Enable GA4 debug_mode parameter
                    </span>
                    <input
                      type="checkbox"
                      checked={debugMode}
                      onChange={(e) => setDebugMode(e.target.checked)}
                      className="w-4 h-4 accent-brand-500"
                    />
                  </label>
                </div>

                {configSaved && (
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold text-center">
                    ✔ Tracking IDs saved and applied!
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition cursor-pointer"
                  >
                    Save & Update Telemetry
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
