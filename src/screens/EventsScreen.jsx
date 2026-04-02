import { useState } from "react";
import { Calendar, MapPin, Users, ChevronRight, Plus, X, Check, HelpCircle, Globe } from "lucide-react";
import { members } from "../data/mockData";

const MY_ID = 1;

function formatDate(d) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(d) {
  const diff = new Date(d + "T00:00:00") - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function EventDetail({ event, onClose, onRsvp }) {
  const goingMembers = members.filter(m => event.going.includes(m.id));
  const maybeMembers = members.filter(m => event.maybe.includes(m.id));
  const myStatus = event.going.includes(MY_ID) ? "going" : event.maybe.includes(MY_ID) ? "maybe" : null;

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()} style={{ maxHeight: "85vh" }}>
        <div className="sheet-handle" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div className="sheet-title" style={{ marginBottom: 4 }}>{event.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text2)", fontSize: 13 }}>
              <MapPin size={13} /> {event.location}
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: "7px" }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16 }}>{event.description}</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {event.distances.map(d => (
            <span key={d} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 600 }}>{d}</span>
          ))}
          <a href={event.website} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 12px", fontSize: 13, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
            <Globe size={13} /> Website
          </a>
        </div>

        <div className="divider" />

        <div className="section-label">Your RSVP</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button className="btn btn-sm" onClick={() => onRsvp(event.id, "going")}
            style={{ background: myStatus === "going" ? "var(--green)" : "var(--surface2)", color: myStatus === "going" ? "#000" : "var(--text)", border: "1px solid var(--border)", flex: 1 }}>
            <Check size={14} /> Going
          </button>
          <button className="btn btn-sm" onClick={() => onRsvp(event.id, "maybe")}
            style={{ background: myStatus === "maybe" ? "var(--accent2)" : "var(--surface2)", color: myStatus === "maybe" ? "#000" : "var(--text)", border: "1px solid var(--border)", flex: 1 }}>
            <HelpCircle size={14} /> Maybe
          </button>
        </div>

        <div className="divider" />

        <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
          <div>
            <div className="section-label">Going ({goingMembers.length})</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {goingMembers.map(m => (
                <div key={m.id} title={m.name} className="avatar-sm" style={{ background: "rgba(61,220,132,0.2)", color: "var(--green)" }}>{m.avatar}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label">Maybe ({maybeMembers.length})</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {maybeMembers.map(m => (
                <div key={m.id} title={m.name} className="avatar-sm" style={{ background: "rgba(245,166,35,0.2)", color: "var(--accent2)" }}>{m.avatar}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddEventSheet({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", date: "", location: "", distances: "", website: "", description: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.date) return;
    onAdd({
      id: Date.now(),
      name: form.name,
      date: form.date,
      location: form.location,
      distances: form.distances.split(",").map(s => s.trim()).filter(Boolean),
      website: form.website,
      description: form.description,
      going: [], maybe: [],
      travel: null, accommodation: null, carpool: [], postRace: null,
    });
    onClose();
  };

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Add Event</div>
        <div className="form-group">
          <label className="form-label">Event Name *</label>
          <input className="input" placeholder="e.g. Gold Coast Marathon" value={form.name} onChange={e => set("name", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="input" type="date" value={form.date} onChange={e => set("date", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Location</label>
          <input className="input" placeholder="City, State" value={form.location} onChange={e => set("location", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Distances (comma separated)</label>
          <input className="input" placeholder="5km, 10km, 21.1km" value={form.distances} onChange={e => set("distances", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Website</label>
          <input className="input" placeholder="https://..." value={form.website} onChange={e => set("website", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="input" rows={3} placeholder="What's this race about?" value={form.description} onChange={e => set("description", e.target.value)} style={{ resize: "none" }} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%", marginTop: 4 }} onClick={submit}>Add Event</button>
      </div>
    </div>
  );
}

export default function EventsScreen({ events, setEvents }) {
  const [detail, setDetail] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleRsvp = (eventId, status) => {
    setEvents(evs => evs.map(ev => {
      if (ev.id !== eventId) return ev;
      let going = ev.going.filter(id => id !== MY_ID);
      let maybe = ev.maybe.filter(id => id !== MY_ID);
      if (status === "going") going = [...going, MY_ID];
      else maybe = [...maybe, MY_ID];
      const updated = { ...ev, going, maybe };
      if (detail?.id === eventId) setDetail(updated);
      return updated;
    }));
  };

  const handleAdd = (event) => setEvents(evs => [...evs, event]);

  const upcoming = events.filter(e => daysUntil(e.date) >= 0).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = events.filter(e => daysUntil(e.date) < 0);

  return (
    <div className="screen">
      <div className="header">
        <div className="header-top">
          <div>
            <div className="header-title">Events</div>
            <div className="header-sub">{upcoming.length} upcoming · {past.length} past</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {upcoming.length > 0 && (
          <>
            <div className="section-label" style={{ marginBottom: 12 }}>Upcoming</div>
            {upcoming.map(ev => {
              const days = daysUntil(ev.date);
              const myStatus = ev.going.includes(MY_ID) ? "going" : ev.maybe.includes(MY_ID) ? "maybe" : null;
              return (
                <div key={ev.id} className="card" style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => setDetail(ev)}>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, letterSpacing: "0.5px", lineHeight: 1.1, marginBottom: 4 }}>{ev.name}</div>
                        <div style={{ display: "flex", gap: 12, color: "var(--text2)", fontSize: 13 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{formatDate(ev.date)}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} />{ev.location}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} color="var(--text3)" style={{ flexShrink: 0, marginTop: 2 }} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text2)" }}>
                          <Users size={13} />
                          <span style={{ color: "var(--green)", fontWeight: 600 }}>{ev.going.length}</span> going ·&nbsp;
                          <span style={{ color: "var(--accent2)", fontWeight: 600 }}>{ev.maybe.length}</span> maybe
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {myStatus && <span className={`pill pill-${myStatus}`}>{myStatus === "going" ? "✓ Going" : "? Maybe"}</span>}
                        <span style={{ fontSize: 12, color: days <= 14 ? "var(--accent)" : "var(--text3)", fontWeight: 600 }}>
                          {days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `${days}d`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {detail && <EventDetail event={detail} onClose={() => setDetail(null)} onRsvp={handleRsvp} />}
      {adding && <AddEventSheet onClose={() => setAdding(false)} onAdd={handleAdd} />}
    </div>
  );
}
