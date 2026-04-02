import { useState } from "react";
import { UserPlus, Timer, Footprints } from "lucide-react";

function InviteSheet({ onClose }) {
  const [email, setEmail] = useState("");
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-title">Invite Member</div>
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 20 }}>
          Send an invite link to join RAB Race Posse.
        </p>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="input" type="email" placeholder="runner@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }}
          onClick={() => { alert(`Invite sent to ${email}!`); onClose(); }}>
          Send Invite
        </button>
      </div>
    </div>
  );
}

export default function GroupScreen({ members, events }) {
  const [inviting, setInviting] = useState(false);

  const getMemberEvents = (memberId) => events.filter(e => e.going.includes(memberId) || e.maybe.includes(memberId));

  return (
    <div className="screen">
      <div className="header">
        <div className="header-top">
          <div>
            <div className="header-title">The Posse</div>
            <div className="header-sub">{members.length} members</div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setInviting(true)}>
            <UserPlus size={15} /> Invite
          </button>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {/* Stats strip */}
        <div className="stat-row" style={{ padding: 0, marginBottom: 16 }}>
          <div className="stat-box">
            <div className="stat-value">{members.length}</div>
            <div className="stat-label">Members</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Events</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{members.reduce((s, m) => s + m.runs, 0)}</div>
            <div className="stat-label">Total Runs</div>
          </div>
        </div>

        {members.map(member => {
          const memberEvents = getMemberEvents(member.id);
          const goingCount = events.filter(e => e.going.includes(member.id)).length;
          return (
            <div key={member.id} className="card" style={{ marginBottom: 10 }}>
              <div style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "center" }}>
                <div className="avatar" style={{ width: 46, height: 46, fontSize: 16, background: member.id === 1 ? "var(--accent)" : `hsl(${member.id * 37}, 60%, 45%)` }}>
                  {member.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{member.name}</span>
                    {member.role === "admin" && (
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--accent)", background: "rgba(232,64,28,0.12)", padding: "2px 7px", borderRadius: 6 }}>Admin</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 4, color: "var(--text2)", fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Timer size={11} /> {member.pace}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Footprints size={11} /> {member.runs} runs</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--green)", lineHeight: 1 }}>{goingCount}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>events</div>
                </div>
              </div>
              {memberEvents.length > 0 && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {memberEvents.map(ev => (
                    <span key={ev.id} style={{ fontSize: 12, color: ev.going.includes(member.id) ? "var(--green)" : "var(--accent2)", background: ev.going.includes(member.id) ? "rgba(61,220,132,0.1)" : "rgba(245,166,35,0.1)", padding: "3px 9px", borderRadius: 8, fontWeight: 500 }}>
                      {ev.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {inviting && <InviteSheet onClose={() => setInviting(false)} />}
    </div>
  );
}
