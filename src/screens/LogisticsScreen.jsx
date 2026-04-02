import { useState } from "react";
import { Car, Hotel, Train, Coffee, ChevronDown, ChevronUp, MapPin, Users } from "lucide-react";

function formatDate(d) {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

function Section({ icon: Icon, title, children, accent }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 0", background: "none", border: "none", cursor: "pointer", color: "var(--text)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: accent || "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 600, fontSize: 14, flex: 1, textAlign: "left" }}>{title}</span>
        {open ? <ChevronUp size={16} color="var(--text3)" /> : <ChevronDown size={16} color="var(--text3)" />}
      </button>
      {open && <div style={{ paddingLeft: 42 }}>{children}</div>}
    </div>
  );
}

export default function LogisticsScreen({ events }) {
  const [selected, setSelected] = useState(events[0]?.id);
  const event = events.find(e => e.id === selected);

  return (
    <div className="screen">
      <div className="header">
        <div className="header-title">Logistics</div>
        <div className="header-sub">Travel, stays & meetups</div>
      </div>

      {/* Event selector */}
      <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
        {events.map(ev => (
          <button key={ev.id} onClick={() => setSelected(ev.id)}
            style={{
              flexShrink: 0, padding: "8px 16px", borderRadius: 20, border: "1px solid",
              borderColor: selected === ev.id ? "var(--accent)" : "var(--border)",
              background: selected === ev.id ? "rgba(232,64,28,0.12)" : "var(--surface)",
              color: selected === ev.id ? "var(--accent)" : "var(--text2)",
              fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)"
            }}>
            {ev.name}
          </button>
        ))}
      </div>

      {event && (
        <div style={{ padding: "0 16px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text2)", fontSize: 13, marginBottom: 4 }}>
              <MapPin size={13} /> {event.location}
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: "0.5px" }}>{event.name}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{formatDate(event.date)}</div>
          </div>

          <div className="card" style={{ padding: "16px" }}>
            {/* Travel */}
            <Section icon={Train} title="Getting There" accent="rgba(100,120,220,0.8)">
              {event.travel ? (
                <div style={{ fontSize: 14, color: "var(--text2)", paddingTop: 4 }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{event.travel.mode}</span> — {event.travel.notes}
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "var(--text3)" }}>No travel info yet</div>
              )}
            </Section>

            <div className="divider" />

            {/* Carpools */}
            <Section icon={Car} title="Carpools" accent="rgba(61,180,100,0.8)">
              {event.carpool?.length > 0 ? event.carpool.map((cp, i) => (
                <div key={i} style={{ marginTop: 6, padding: "10px 12px", background: "var(--surface2)", borderRadius: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{cp.driver}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2, display: "flex", gap: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {cp.seats} seats</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> From {cp.from}</span>
                  </div>
                </div>
              )) : (
                <div style={{ fontSize: 14, color: "var(--text3)" }}>No carpools organised yet</div>
              )}
            </Section>

            <div className="divider" />

            {/* Accommodation */}
            <Section icon={Hotel} title="Accommodation" accent="rgba(200,100,60,0.8)">
              {event.accommodation ? (
                <div style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{event.accommodation.name}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: event.accommodation.booked ? "rgba(61,220,132,0.15)" : "rgba(245,166,35,0.15)", color: event.accommodation.booked ? "var(--green)" : "var(--accent2)" }}>
                      {event.accommodation.booked ? "Booked ✓" : "Not booked"}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>{event.accommodation.address}</div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "var(--text3)" }}>No accommodation info yet</div>
              )}
            </Section>

            <div className="divider" />

            {/* Post race */}
            <Section icon={Coffee} title="Post-Race Meetup" accent="rgba(220,160,40,0.8)">
              {event.postRace ? (
                <div style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: 10 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{event.postRace.venue}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>🕐 {event.postRace.time}</div>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: "var(--text3)" }}>No meetup planned yet</div>
              )}
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}
