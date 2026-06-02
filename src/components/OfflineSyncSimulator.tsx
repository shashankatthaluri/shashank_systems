"use client";

import { useState, useEffect, useRef } from "react";
import { Terminal, Wifi, WifiOff, RefreshCw, Plus, Clock, Play, AlertCircle, CheckCircle2 } from "lucide-react";

interface LogMessage {
  time: string;
  source: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "system";
}

interface OrderItem {
  id: string;
  item: string;
  device: "Tablet_A" | "Tablet_B";
  physicalTime: string;
  unixTime: number;
  lamportTime: number;
}

export default function OfflineSyncSimulator() {
  // Connection states
  const [tabletAOnline, setTabletAOnline] = useState(false);
  const [tabletBOnline, setTabletBOnline] = useState(true);
  
  // Clock drift state (in seconds)
  const [tabletADrift, setTabletADrift] = useState(-45); // Tablet A is 45s slow
  const [tabletBDrift, setTabletBDrift] = useState(0);   // Tablet B is on time

  // Chosen sync strategy
  const [strategy, setStrategy] = useState<"naive" | "lamport">("lamport");

  // Local device queues
  const [tabletAQueue, setTabletAQueue] = useState<OrderItem[]>([]);
  const [tabletBQueue, setTabletBQueue] = useState<OrderItem[]>([]);
  
  // Server-reconciled orders
  const [serverOrders, setServerOrders] = useState<OrderItem[]>([]);

  // Logical clock states
  const [clockA, setClockA] = useState(1);
  const [clockB, setClockB] = useState(1);
  const [serverClock, setServerClock] = useState(1);

  // Debug Console Logs
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Helper to add log messages
  const addLog = (source: string, message: string, type: LogMessage["type"] = "info") => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((prev) => [...prev, { time, source, message, type }]);
  };

  // Scroll to bottom of logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Initial log
  useEffect(() => {
    addLog("SYSTEM", "Initialized Offline Sync & Actor Replay Engine.", "system");
    addLog("TABLET_A", "Local SQLite active. Connection status: OFFLINE. Clock drift set to -45s.", "warning");
    addLog("TABLET_B", "Local SQLite active. Connection status: ONLINE. Clock drift set to 0s.", "success");
    addLog("SERVER", "PostgreSQL database ready. Listening for WebSocket broadcasts.", "info");
  }, []);

  // Sync state transitions to logs
  const toggleAConnection = () => {
    const nextState = !tabletAOnline;
    setTabletAOnline(nextState);
    if (nextState) {
      addLog("TABLET_A", "WebSocket connection re-established with Gateway RPi.", "success");
      addLog("SYSTEM", "Triggering synchronization queue replay...", "system");
      replayTabletQueue("Tablet_A");
    } else {
      addLog("TABLET_A", "Connection lost. Dropping to offline SQLite sandbox mode.", "error");
    }
  };

  const toggleBConnection = () => {
    const nextState = !tabletBOnline;
    setTabletBOnline(nextState);
    if (nextState) {
      addLog("TABLET_B", "WebSocket connection re-established with Gateway RPi.", "success");
      addLog("SYSTEM", "Triggering synchronization queue replay...", "system");
      replayTabletQueue("Tablet_B");
    } else {
      addLog("TABLET_B", "Connection lost. Dropping to offline SQLite sandbox mode.", "error");
    }
  };

  // Add Item Action
  const addItem = (device: "Tablet_A" | "Tablet_B", item: string) => {
    const isA = device === "Tablet_A";
    const isOnline = isA ? tabletAOnline : tabletBOnline;
    const drift = isA ? tabletADrift : tabletBDrift;
    
    // Calculate simulated times
    const realUnix = Date.now();
    const simulatedUnix = realUnix + drift * 1000;
    const simTimeStr = new Date(simulatedUnix).toLocaleTimeString("en-US", { hour12: false });

    // Logical Clock calculations
    let currentLocalClock = isA ? clockA : clockB;
    const itemLamport = currentLocalClock;
    const nextLocalClock = currentLocalClock + 1;
    
    if (isA) {
      setClockA(nextLocalClock);
    } else {
      setClockB(nextLocalClock);
    }

    const newItem: OrderItem = {
      id: `${device}_${Math.random().toString(36).substr(2, 5)}`,
      item,
      device,
      physicalTime: simTimeStr,
      unixTime: simulatedUnix,
      lamportTime: itemLamport
    };

    addLog(device.toUpperCase(), `Captured order [${item}]. Local_Clock = ${itemLamport}, Timestamp = ${simTimeStr}`, "info");

    if (isOnline) {
      // Direct write to server + sync log
      addLog("SERVER", `Direct WS Ingestion: [${item}] from ${device}. Processing merge...`, "info");
      
      // Update server state
      setServerClock((prev) => {
        const nextServer = Math.max(prev, itemLamport) + 1;
        addLog("SERVER", `Reconciled logical clock. Pre-sync = ${prev}, Post-sync = ${nextServer}`, "system");
        return nextServer;
      });

      setServerOrders((prev) => {
        const merged = [...prev, newItem];
        return sortOrders(merged);
      });
    } else {
      // Buffer in local SQLite queue
      addLog(device.toUpperCase(), `Buffering [${item}] in local SQLite queue (un-synced).`, "warning");
      if (isA) {
        setTabletAQueue((prev) => [...prev, newItem]);
      } else {
        setTabletBQueue((prev) => [...prev, newItem]);
      }
    }
  };

  // Sort orders based on strategy
  const sortOrders = (ordersList: OrderItem[]): OrderItem[] => {
    if (strategy === "naive") {
      // Sort purely chronologically by device timestamps (prone to clock drift issues)
      return [...ordersList].sort((a, b) => a.unixTime - b.unixTime);
    } else {
      // Sort by Lamport Timestamps, resolve ties by device name
      return [...ordersList].sort((a, b) => {
        if (a.lamportTime === b.lamportTime) {
          return a.device.localeCompare(b.device);
        }
        return a.lamportTime - b.lamportTime;
      });
    }
  };

  // Replay buffered changes when tablet comes online
  const replayTabletQueue = (device: "Tablet_A" | "Tablet_B") => {
    const isA = device === "Tablet_A";
    const queue = isA ? tabletAQueue : tabletBQueue;
    
    if (queue.length === 0) {
      addLog(device.toUpperCase(), "SQLite queue empty. No events to replay.", "info");
      return;
    }

    addLog("SERVER", `Processing queue replay for ${device} (${queue.length} events)`, "system");

    setServerOrders((prev) => {
      let currentServerOrders = [...prev];
      let currentServerClock = serverClock;

      queue.forEach((item) => {
        addLog("SERVER", `Replaying [${item.item}] (Local_Clock = ${item.lamportTime}, Timestamp = ${item.physicalTime})`, "info");
        
        // Merge event
        currentServerOrders.push(item);
        
        // Reconcile Lamport Clock: L_server = max(L_server, L_item) + 1
        currentServerClock = Math.max(currentServerClock, item.lamportTime) + 1;
      });

      setServerClock(currentServerClock);
      addLog("SERVER", `Queue replay complete. Reconciled clock = ${currentServerClock}`, "success");
      return sortOrders(currentServerOrders);
    });

    // Clear local queue
    if (isA) {
      setTabletAQueue([]);
    } else {
      setTabletBQueue([]);
    }
  };

  // Handle strategy switch and re-sort server orders
  const handleStrategyChange = (newStrategy: "naive" | "lamport") => {
    setStrategy(newStrategy);
    setServerOrders((prev) => sortOrders(prev));
    addLog("SYSTEM", `Switched sorting sequence protocol to: ${newStrategy.toUpperCase()}`, "system");
  };

  // Clear all states
  const clearSim = () => {
    setTabletAQueue([]);
    setTabletBQueue([]);
    setServerOrders([]);
    setClockA(1);
    setClockB(1);
    setServerClock(1);
    setLogs([]);
    addLog("SYSTEM", "Sim reset complete. Queues cleared.", "system");
  };

  return (
    <div className="border border-border-subtle rounded-2xl overflow-hidden bg-card-bg/15 font-sans relative shadow-2xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* Title block */}
      <div className="px-6 py-4 border-b border-border-subtle bg-background/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative z-10">
        <div>
          <span className="text-[9px] font-mono text-accent uppercase tracking-wider block font-bold">
            Interactive System Demo
          </span>
          <h4 className="font-heading text-lg font-bold text-foreground">
            Offline Queue Replay & Lamport Clock Simulator
          </h4>
        </div>
        
        {/* Reset button */}
        <button
          onClick={clearSim}
          className="px-3 py-1.5 rounded-lg border border-border-subtle hover:border-accent/40 bg-card-bg text-xs font-mono text-text-muted hover:text-foreground flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="h-3 w-3" />
          <span>RESET SIMULATOR</span>
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-border-subtle/50 relative z-10">
        
        {/* TABLET A (OFFLINE BY DEFAULT) */}
        <div className="lg:col-span-4 p-5 bg-background/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <h5 className="text-xs font-mono font-bold text-foreground">TABLET_A // WAITER</h5>
            </div>
            
            <button
              onClick={toggleAConnection}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 transition-all ${
                tabletAOnline 
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500" 
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-500"
              }`}
            >
              {tabletAOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{tabletAOnline ? "ONLINE" : "OFFLINE"}</span>
            </button>
          </div>

          {/* Time drift configuration */}
          <div className="space-y-1 bg-card-bg/25 border border-border-subtle/40 p-3 rounded-lg text-xs font-mono">
            <div className="flex justify-between text-text-muted text-[10px]">
              <span>CLOCK CONFIGURATION</span>
              <span className="text-[#ffc67a]">DRIFT: {tabletADrift}s</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
              <input
                type="range"
                min="-120"
                max="120"
                value={tabletADrift}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTabletADrift(val);
                  addLog("TABLET_A", `Adjusted clock drift bias to ${val}s.`, "info");
                }}
                className="w-full h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
            <div className="text-[10px] text-text-muted mt-1 leading-tight">
              Tablet A's system clock is shifted backward by {Math.abs(tabletADrift)}s to simulate device clock drift.
            </div>
          </div>

          {/* Add Order Buttons */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-text-muted block font-semibold">RING ORDER ITEMS</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addItem("Tablet_A", "Starter: Spring Rolls")}
                className="px-2.5 py-2 rounded-lg border border-border-subtle bg-card-bg hover:border-accent/40 text-xs font-medium text-foreground flex items-center justify-between transition-all"
              >
                <span>Ring Starter</span>
                <Plus className="h-3 w-3 text-accent" />
              </button>
              <button
                onClick={() => addItem("Tablet_A", "Dessert: Mochi Ice Cream")}
                className="px-2.5 py-2 rounded-lg border border-border-subtle bg-card-bg hover:border-accent/40 text-xs font-medium text-foreground flex items-center justify-between transition-all"
              >
                <span>Ring Dessert</span>
                <Plus className="h-3 w-3 text-accent" />
              </button>
            </div>
          </div>

          {/* Local buffered queue */}
          <div className="bg-card-bg/15 border border-border-subtle/50 rounded-xl p-3 space-y-2 font-mono">
            <span className="text-[9px] font-bold text-text-muted block">SQLITE BUFFERED QUEUE ({tabletAQueue.length})</span>
            {tabletAQueue.length === 0 ? (
              <span className="text-[10px] text-text-muted/65 italic block py-2">SQLite sandbox empty. All mutations synced.</span>
            ) : (
              <div className="space-y-1 max-h-[100px] overflow-y-auto scrollbar pr-1">
                {tabletAQueue.map((item) => (
                  <div key={item.id} className="text-[10px] bg-card-bg/40 p-1.5 rounded border border-border-subtle/30 flex justify-between">
                    <span className="text-foreground truncate pr-2">{item.item}</span>
                    <span className="text-accent shrink-0 font-bold">L_clock: {item.lamportTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TABLET B (ONLINE BY DEFAULT) */}
        <div className="lg:col-span-4 p-5 bg-background/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <h5 className="text-xs font-mono font-bold text-foreground">TABLET_B // WAITER</h5>
            </div>
            
            <button
              onClick={toggleBConnection}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 transition-all ${
                tabletBOnline 
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-500" 
                  : "bg-rose-500/10 border border-rose-500/30 text-rose-500"
              }`}
            >
              {tabletBOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              <span>{tabletBOnline ? "ONLINE" : "OFFLINE"}</span>
            </button>
          </div>

          {/* Time drift configuration */}
          <div className="space-y-1 bg-card-bg/25 border border-border-subtle/40 p-3 rounded-lg text-xs font-mono">
            <div className="flex justify-between text-text-muted text-[10px]">
              <span>CLOCK CONFIGURATION</span>
              <span className="text-emerald-500">DRIFT: {tabletBDrift}s</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
              <input
                type="range"
                min="-120"
                max="120"
                value={tabletBDrift}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setTabletBDrift(val);
                  addLog("TABLET_B", `Adjusted clock drift bias to ${val}s.`, "info");
                }}
                className="w-full h-1 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
            <div className="text-[10px] text-text-muted mt-1 leading-tight">
              Tablet B's system clock matches actual UTC time (0s drift relative to servers).
            </div>
          </div>

          {/* Add Order Buttons */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-text-muted block font-semibold">RING ORDER ITEMS</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addItem("Tablet_B", "Starter: Spring Rolls")}
                className="px-2.5 py-2 rounded-lg border border-border-subtle bg-card-bg hover:border-accent/40 text-xs font-medium text-foreground flex items-center justify-between transition-all"
              >
                <span>Ring Starter</span>
                <Plus className="h-3 w-3 text-accent" />
              </button>
              <button
                onClick={() => addItem("Tablet_B", "Dessert: Mochi Ice Cream")}
                className="px-2.5 py-2 rounded-lg border border-border-subtle bg-card-bg hover:border-accent/40 text-xs font-medium text-foreground flex items-center justify-between transition-all"
              >
                <span>Ring Dessert</span>
                <Plus className="h-3 w-3 text-accent" />
              </button>
            </div>
          </div>

          {/* Local buffered queue */}
          <div className="bg-card-bg/15 border border-border-subtle/50 rounded-xl p-3 space-y-2 font-mono">
            <span className="text-[9px] font-bold text-text-muted block">SQLITE BUFFERED QUEUE ({tabletBQueue.length})</span>
            {tabletBQueue.length === 0 ? (
              <span className="text-[10px] text-text-muted/65 italic block py-2">SQLite sandbox empty. All mutations synced.</span>
            ) : (
              <div className="space-y-1 max-h-[100px] overflow-y-auto scrollbar pr-1">
                {tabletBQueue.map((item) => (
                  <div key={item.id} className="text-[10px] bg-card-bg/40 p-1.5 rounded border border-border-subtle/30 flex justify-between">
                    <span className="text-foreground truncate pr-2">{item.item}</span>
                    <span className="text-accent shrink-0 font-bold">L_clock: {item.lamportTime}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SERVER RECONCILIATION SCREEN */}
        <div className="lg:col-span-4 p-5 bg-background/80 space-y-4">
          <div className="border-b border-border-subtle/30 pb-3">
            <span className="text-[9px] font-mono text-accent block font-bold">CENTRAL STATE DATASTORE</span>
            <h5 className="text-xs font-mono font-bold text-foreground">RPi GATEWAY POSTGRESQL</h5>
          </div>

          {/* Strategy selection */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono text-text-muted block font-semibold">RECONCILIATION ALGORITHM</span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-background border border-border-subtle rounded-lg font-mono text-[9.5px]">
              <button
                onClick={() => handleStrategyChange("naive")}
                className={`py-1.5 rounded px-1 text-center font-bold transition-all ${
                  strategy === "naive"
                    ? "bg-accent/15 text-accent border border-accent/25"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                NAIVE TIMESTAMP
              </button>
              <button
                onClick={() => handleStrategyChange("lamport")}
                className={`py-1.5 rounded px-1 text-center font-bold transition-all ${
                  strategy === "lamport"
                    ? "bg-accent/15 text-accent border border-accent/25"
                    : "text-text-muted hover:text-foreground"
                }`}
              >
                LAMPORT CLOCK
              </button>
            </div>
          </div>

          {/* Render Reconciled Orders (The Kitchen screen view) */}
          <div className="bg-card-bg/20 border border-border-subtle rounded-xl p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
              <span className="text-[9.5px] font-bold text-foreground">KITCHEN MONITOR SEQUENCE</span>
              <span className="text-[9px] text-text-muted">CLOCK: {serverClock}</span>
            </div>

            {serverOrders.length === 0 ? (
              <div className="text-center py-6 text-text-muted/60 text-[10px] italic">
                Awaiting order dispatch...
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar pr-1">
                {serverOrders.map((order, index) => {
                  // Figure out if this order represents a conflict crash (e.g. Dessert ordered on B syncs before Starter on offline A)
                  const isFirstDessert = order.item.includes("Dessert") && index === 0;
                  
                  return (
                    <div
                      key={order.id}
                      className={`p-2 rounded border text-[10.5px] leading-tight flex justify-between items-start transition-all duration-300 ${
                        isFirstDessert
                          ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                          : "bg-background border-border-subtle/50 text-foreground"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="font-bold flex items-center gap-1">
                          <span>{index + 1}. {order.item}</span>
                          {isFirstDessert && (
                            <span title="CONCURRENCY SEQUENCE CORRUPTED">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[8.5px] text-text-muted mt-0.5">
                          Node: {order.device} | time: {order.physicalTime}
                        </div>
                      </div>
                      <span className={`text-[8.5px] px-1 py-0.2 rounded font-bold shrink-0 ${
                        strategy === "lamport" ? "bg-accent/10 border border-accent/20 text-accent" : "bg-border-subtle text-text-muted"
                      }`}>
                        {strategy === "lamport" ? `L: ${order.lamportTime}` : `T: ${order.physicalTime}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Error disclaimer if Naive sort results in Dessert first */}
            {serverOrders.length > 0 && serverOrders[0].item.includes("Dessert") && strategy === "naive" && (
              <div className="p-2.5 border border-rose-500/30 rounded-lg bg-rose-500/5 text-[9.5px] text-rose-400 font-sans leading-relaxed">
                <strong>WARNING: Real-world dining room chaos!</strong> The dessert was queued first on the kitchen screen. During a Friday night lunch rush, this exact clock drift caused the kitchen staff to send mochi ice cream to Table 12 before their spring rolls had even been rolled. Tablet A's clock was drifted 45s slow. Switch to <strong>LAMPORT CLOCK</strong> to resolve.
              </div>
            )}
 
            {serverOrders.length > 0 && strategy === "lamport" && (
              <div className="p-2.5 border border-emerald-500/30 rounded-lg bg-emerald-500/5 text-[9.5px] text-emerald-400 font-sans leading-relaxed flex items-start gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Lamport sequencing active:</strong> The causal ordering is preserved. Starters correctly precede desserts on the kitchen dispatcher regardless of tablet clock drifts, preventing server confusion.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REAL-TIME SIMULATION DEBUG CONSOLE LOGS */}
      <div className="border-t border-border-subtle bg-background/90 font-mono text-[10px]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle/50 text-[9px] text-text-muted font-bold tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <Terminal className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Actor Replication Sync Logs</span>
          </div>
          <span>Interactive Shell Console</span>
        </div>

        {/* Logs viewport */}
        <div className="p-4 max-h-[140px] min-h-[140px] overflow-y-auto scrollbar space-y-1 text-foreground/90 font-mono leading-normal">
          {logs.length === 0 ? (
            <span className="text-text-muted/50 italic select-none">Shell idle. captured events will print here.</span>
          ) : (
            logs.map((log, idx) => {
              let color = "text-text-muted";
              if (log.type === "success") color = "text-emerald-500";
              if (log.type === "warning") color = "text-[#ffc67a]";
              if (log.type === "error") color = "text-rose-500";
              if (log.type === "system") color = "text-accent font-bold";

              return (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-text-muted/40 shrink-0 select-none">[{log.time}]</span>
                  <span className={`font-bold shrink-0 ${
                    log.source === "SERVER" ? "text-accent" : "text-[#7ea3cc]"
                  }`}>
                    {log.source}:
                  </span>
                  <span className={color}>{log.message}</span>
                </div>
              );
            })
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
