import { useState } from "react";
import { Calendar, Users, Map, Trophy } from "lucide-react";
import "./index.css";
import EventsScreen from "./screens/EventsScreen";
import GroupScreen from "./screens/GroupScreen";
import LogisticsScreen from "./screens/LogisticsScreen";
import MyRunsScreen from "./screens/MyRunsScreen";
import { useEvents, useMembers, useMyRuns } from "./hooks/useSupabase";

// Change this to your own member ID from Supabase
const MY_MEMBER_ID = 1;

const tabs = [
  { id: "events", label: "Events", icon: Calendar },
  { id: "group", label: "Group", icon: Users },
  { id: "logistics", label: "Logistics", icon: Map },
  { id: "my-runs", label: "My Runs", icon: Trophy },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("events");
  const { events, loading: eventsLoading, addEvent, rsvp } = useEvents();
  const { members, loading: membersLoading } = useMembers();
  const { myRuns, loading: runsLoading, addRun } = useMyRuns(MY_MEMBER_ID);

  const loading = eventsLoading || membersLoading;

  return (
    <div className="app">
      {/* Logo strip */}
      <div style={{
        position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430, zIndex: 50, pointerEvents: "none",
        padding: "12px 20px 0",
        display: "flex", alignItems: "center", gap: 8
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontSize: 13, letterSpacing: "3px",
          color: "var(--accent)", background: "rgba(232,64,28,0.12)",
          padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(232,64,28,0.25)"
        }}>
          RAB RACE POSSE
        </div>
      </div>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <div style={{ color: "var(--text2)", fontSize: 14 }}>Loading your posse...</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {activeTab === "events" && (
            <EventsScreen
              events={events}
              members={members}
              myMemberId={MY_MEMBER_ID}
              onAddEvent={addEvent}
              onRsvp={rsvp}
            />
          )}
          {activeTab === "group" && <GroupScreen members={members} events={events} />}
          {activeTab === "logistics" && <LogisticsScreen events={events} />}
          {activeTab === "my-runs" && (
            <MyRunsScreen myRuns={myRuns} onAddRun={addRun} loading={runsLoading} />
          )}
        </>
      )}

      {/* Tab bar */}
      <nav className="tab-bar">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            <Icon />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
