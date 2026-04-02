import { useState } from "react";
import { Plus, Trophy, Clock, Ruler, Star } from "lucide-react";

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function LogRunSheet({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", date: "", distance: "", time: "", pb: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.date) return;
    await onAdd(form);
    onClose();
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Log a Run</div>
        <div className="form-group">
          <label className="form-label">Race / Run Name *</label>
          <input className="input" placeholder="e.g. Parkrun #120" value={form.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Distance</label>
            <input className="input" placeholder="e.g. 10km" value={form.distance} onChange={e => set("distance", e.target.value)} />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Finish Time</label>
            <input className="input" placeholder="h:mm:ss" value={form.time} onChange={e => set("time", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface2)", borderRadius: 10, marginBottom: 16, cursor: "pointer" }}
          onClick={() => set("pb", !form.pb)}>
          <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid", borderColor: form.pb ? "var(--accent)" : "var(--border)", background: form.pb ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {form.pb && <Star size={13} color="#fff" fill="#fff" />}
          </div>
          <span style={{ fontWeight: 600, fontSize: 14 }}>This was a Personal Best! 🏆</span>
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} onClick={submit}>Save Run</button>
      </div>
    </div>
  );
}

export default function MyRunsScreen({ myRuns, onAddRun, loading }) {
  const [logging, setLogging] = useState(false);

  const pbs = myRuns.filter(r => r.pb);

  if (loading) return (
    <div className="screen" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "var(--text2)" }}>Loading your runs...</div>
    </div>
  );

  return (
    <div className="screen">
      <div className="header">
        <div className="header-top">
          <div>
            <div className="header-title">My Runs</div>
            <div className="header-sub">{myRuns.length} logged · {pbs.length} PBs</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setLogging(true)}>
            <Plus size={15} /> Log Run
          </button>
        </div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div className="stat-row" style={{ padding: 0, marginBottom: 16 }}>
          <div className="stat-box">
            <div className="stat-value">{myRuns.length}</div>
            <div className="stat-label">Logged</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{pbs.length}</div>
            <div className="stat-label">PBs</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{myRuns.filter(r => r.distance?.includes("km")).length}</div>
            <div className="stat-label">Races</div>
          </div>
        </div>
        {myRuns.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text3)" }}>
            <Trophy size={40} strokeWidth={1} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>No runs yet</div>
            <div style={{ fontSize: 14 }}>Log your first run above</div>
          </div>
        )}
        {myRuns.map(run => (
          <div key={run.id} className="card" style={{ marginBottom: 10 }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: "0.3px" }}>{run.name}</span>
                {run.pb && <span className="pill pill-pb" style={{ fontSize: 11 }}>PB</span>}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{formatDate(run.date)}</div>
              <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                {run.distance && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text2)", fontSize: 13 }}>
                    <Ruler size={13} color="var(--accent)" /> {run.distance}
                  </div>
                )}
                {run.time && (
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text2)", fontSize: 13 }}>
                    <Clock size={13} color="var(--accent)" /> {run.time}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {logging && <LogRunSheet onClose={() => setLogging(false)} onAdd={onAddRun} />}
    </div>
  );
}
