import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    const { data: eventsData } = await supabase.from("events").select("*").order("date");
    const { data: rsvpsData } = await supabase.from("rsvps").select("*");

    if (eventsData) {
      const enriched = eventsData.map(ev => ({
        ...ev,
        going: rsvpsData?.filter(r => r.event_id === ev.id && r.status === "going").map(r => r.member_id) || [],
        maybe: rsvpsData?.filter(r => r.event_id === ev.id && r.status === "maybe").map(r => r.member_id) || [],
      }));
      setEvents(enriched);
    }
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const addEvent = async (event) => {
    const { data } = await supabase.from("events").insert([{
      name: event.name,
      date: event.date,
      location: event.location,
      distances: event.distances,
      website: event.website,
      description: event.description,
      travel: event.travel || null,
      accommodation: event.accommodation || null,
      carpool: event.carpool || [],
      post_race: event.postRace || null,
    }]).select().single();
    if (data) setEvents(evs => [...evs, { ...data, going: [], maybe: [] }]);
  };

  const rsvp = async (eventId, memberId, status) => {
    await supabase.from("rsvps").upsert({ event_id: eventId, member_id: memberId, status }, { onConflict: "event_id,member_id" });
    await fetchEvents();
  };

  return { events, loading, addEvent, rsvp };
}

export function useMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("members").select("*").order("id").then(({ data }) => {
      if (data) setMembers(data);
      setLoading(false);
    });
  }, []);

  const inviteMember = async (name, pace) => {
    const avatar = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const { data } = await supabase.from("members").insert([{ name, avatar, pace, runs: 0, role: "member" }]).select().single();
    if (data) setMembers(m => [...m, data]);
  };

  return { members, loading, inviteMember };
}

export function useMyRuns(memberId) {
  const [myRuns, setMyRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("my_runs").select("*").eq("member_id", memberId).order("date", { ascending: false }).then(({ data }) => {
      if (data) setMyRuns(data);
      setLoading(false);
    });
  }, [memberId]);

  const addRun = async (run) => {
    const { data } = await supabase.from("my_runs").insert([{ ...run, member_id: memberId }]).select().single();
    if (data) setMyRuns(runs => [data, ...runs]);
  };

  return { myRuns, loading, addRun };
}
