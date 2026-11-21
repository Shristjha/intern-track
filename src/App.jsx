
import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, BriefcaseBusiness, CalendarDays,
  UserRound, Settings, Search, Bell, Plus,
  TrendingUp, Clock, CheckCircle, XCircle,
  MapPin, Pencil, Trash2, Moon, Sun,
  BarChart3, Filter, Download, Save, X
} from "lucide-react";
import "./App.css";

const initialApplications = [
  { id: 1, company: "Google", role: "Software Developer Intern", location: "Bengaluru", date: "Nov 20, 2026", status: "Applied" },
  { id: 2, company: "Microsoft", role: "Frontend Developer Intern", location: "Hyderabad", date: "Nov 18, 2026", status: "Interview" },
  { id: 3, company: "Deloitte", role: "Technology Intern", location: "Bengaluru", date: "Nov 15, 2026", status: "Selected" },
  { id: 4, company: "Amazon", role: "Web Development Intern", location: "Remote", date: "Nov 12, 2026", status: "Rejected" }
];

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem("interntrack-applications");
      return saved ? JSON.parse(saved) : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dark, setDark] = useState(false);

  const [form, setForm] = useState({
    company: "", role: "", location: "", status: "Applied"
  });

  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("interntrack-profile")) || {
        name: "Shristi Jha",
        course: "B.Tech Computer Science & Engineering",
        university: "Jain University",
        email: "",
        skills: "Java, Python, React, JavaScript"
      };
    } catch {
      return {
        name: "Shristi Jha",
        course: "B.Tech Computer Science & Engineering",
        university: "Jain University",
        email: "",
        skills: "Java, Python, React, JavaScript"
      };
    }
  });

  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("interntrack-events")) || [];
    } catch {
      return [];
    }
  });

  const [eventForm, setEventForm] = useState({
    title: "", date: "", type: "Interview"
  });

  useEffect(() => {
    localStorage.setItem("interntrack-applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("interntrack-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("interntrack-events", JSON.stringify(events));
  }, [events]);

  const applied = applications.filter(a => a.status === "Applied").length;
  const interviews = applications.filter(a => a.status === "Interview").length;
  const selected = applications.filter(a => a.status === "Selected").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = `${app.company} ${app.role} ${app.status}`
        .toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "All" || app.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [applications, search, filter]);

  function openAddForm() {
    setEditingId(null);
    setForm({ company: "", role: "", location: "", status: "Applied" });
    setShowForm(true);
  }

  function openEditForm(app) {
    setEditingId(app.id);
    setForm({
      company: app.company,
      role: app.role,
      location: app.location,
      status: app.status
    });
    setShowForm(true);
  }

  function saveApplication(e) {
    e.preventDefault();

    if (!form.company.trim() || !form.role.trim()) return;

    if (editingId) {
      setApplications(prev => prev.map(app =>
        app.id === editingId ? { ...app, ...form } : app
      ));
    } else {
      setApplications(prev => [{
        id: Date.now(),
        ...form,
        date: new Date().toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric"
        })
      }, ...prev]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ company: "", role: "", location: "", status: "Applied" });
  }

  function deleteApplication(id) {
    if (window.confirm("Delete this internship application?")) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  }

  function downloadCSV() {
    const header = ["Company", "Role", "Location", "Date", "Status"];
    const rows = applications.map(a =>
      [a.company, a.role, a.location, a.date, a.status]
    );

    const csv = [header, ...rows]
      .map(row => row.map(value =>
        `"${String(value).replace(/"/g, '""')}"`
      ).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interntrack-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function addEvent(e) {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.date) return;

    setEvents(prev => [...prev, {
      id: Date.now(),
      ...eventForm
    }]);

    setEventForm({ title: "", date: "", type: "Interview" });
  }

  const pages = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Applications", icon: BriefcaseBusiness },
    { name: "Kanban Board", icon: BarChart3 },
    { name: "Calendar", icon: CalendarDays },
    { name: "Analytics", icon: TrendingUp },
    { name: "Notifications", icon: Bell },
    { name: "Resume Manager", icon: Download },
    { name: "Profile", icon: UserRound }
  ];

  const applicationTable = (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Internship Applications</h3>
          <p>Manage and track your opportunities.</p>
        </div>
        <span className="count-badge">{filteredApplications.length} applications</span>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          placeholder="Search company or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <Filter size={18} />
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding: 9, borderRadius: 8, border: "1px solid #ddd" }}>
          {["All", "Applied", "Interview", "Selected", "Rejected"].map(s =>
            <option key={s}>{s}</option>
          )}
        </select>
        <button className="primary-button" onClick={downloadCSV}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>COMPANY & ROLE</th>
              <th>LOCATION</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => (
              <tr key={app.id}>
                <td><strong>{app.company}</strong><small>{app.role}</small></td>
                <td><MapPin size={14} /> {app.location}</td>
                <td>{app.date}</td>
                <td>
                  <select
                    value={app.status}
                    onChange={e => setApplications(prev => prev.map(a =>
                      a.id === app.id ? { ...a, status: e.target.value } : a
                    ))}
                    className={`status ${app.status.toLowerCase()}`}
                    aria-label={`Status for ${app.company}`}
                  >
                    {["Applied", "Interview", "Selected", "Rejected"].map(s =>
                      <option key={s}>{s}</option>
                    )}
                  </select>
                </td>
                <td>
                  <button className="icon-button" title="Edit"
                    onClick={() => openEditForm(app)}>
                    <Pencil size={16} />
                  </button>
                  <button className="icon-button" title="Delete"
                    onClick={() => deleteApplication(app.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredApplications.length === 0 &&
          <p className="empty-message">No matching applications found.</p>}
      </div>
    </section>
  );

  return (
    <div className={`app-layout ${dark ? "dark-mode" : ""}`}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><BriefcaseBusiness size={23} /></div>
          <span>InternTrack</span>
        </div>

        <p className="menu-label">WORKSPACE</p>
        <nav className="navigation">
          {pages.map(({ name, icon: Icon }) => (
            <button key={name}
              className={`nav-item ${activePage === name ? "active" : ""}`}
              onClick={() => setActivePage(name)}>
              <Icon size={19} /> {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setDark(!dark)}>
            {dark ? <Sun size={19} /> : <Moon size={19} />}
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
          <div className="profile-mini">
            <div className="avatar">S</div>
            <div><strong>{profile.name}</strong><small>Student Account</small></div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace / <strong>{activePage}</strong></div>
          <div className="topbar-right">
            <button className="icon-button" onClick={() => setActivePage("Notifications")}>
              <Bell size={20} />
              {events.length > 0 && <span className="notification-dot" />}
            </button>
            <div className="avatar">S</div>
          </div>
        </header>

        <section className="content-area">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">STUDENT WORKSPACE</p>
              <h1>{activePage === "Dashboard" ? `Welcome back, ${profile.name}!` : activePage}</h1>
              <p className="subtitle">Your internship journey, organised in one place.</p>
            </div>
            <button className="primary-button" onClick={openAddForm}>
              <Plus size={18} /> Add Internship
            </button>
          </div>

          {(activePage === "Dashboard" || activePage === "Applications") && (
            <>
              <div className="stats-grid">
                {[
                  ["Total Applications", applications.length, BriefcaseBusiness, "purple"],
                  ["Applied", applied, Clock, "blue"],
                  ["Interviews", interviews, Bell, "orange"],
                  ["Selected", selected, CheckCircle, "green"]
                ].map(([label, count, Icon, color]) => (
                  <div className="stat-card" key={label}>
                    <div className="stat-top">
                      <span>{label}</span>
                      <div className={`stat-icon ${color}`}><Icon size={21} /></div>
                    </div>
                    <h2>{count}</h2>
                    <p><TrendingUp size={14} /> Updated automatically</p>
                  </div>
                ))}
              </div>
              {applicationTable}
            </>
          )}

          {activePage === "Kanban Board" && (
            <div className="content-grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))" }}>
              {["Applied", "Interview", "Selected", "Rejected"].map(status => (
                <section className="panel" key={status}>
                  <div className="panel-heading">
                    <h3>{status}</h3>
                    <span className="count-badge">
                      {applications.filter(a => a.status === status).length}
                    </span>
                  </div>
                  {applications.filter(a => a.status === status).map(app => (
                    <div key={app.id} style={{ padding: 14, borderRadius: 10, background: "#f3efff", marginBottom: 10 }}>
                      <strong>{app.company}</strong>
                      <p style={{ fontSize: 12, marginTop: 7 }}>{app.role}</p>
                      <select value={app.status}
                        onChange={e => setApplications(prev => prev.map(a =>
                          a.id === app.id ? { ...a, status: e.target.value } : a
                        ))}>
                        {["Applied", "Interview", "Selected", "Rejected"].map(s =>
                          <option key={s}>{s}</option>
                        )}
                      </select>
                    </div>
                  ))}
                </section>
              ))}
            </div>
          )}

          {activePage === "Calendar" && (
            <div className="panel">
              <h3>Upcoming Events & Interviews</h3>
              <form onSubmit={addEvent} style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "20px 0" }}>
                <input placeholder="Event title" value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })} required />
                <input type="date" value={eventForm.date}
                  onChange={e => setEventForm({ ...eventForm, date: e.target.value })} required />
                <select value={eventForm.type}
                  onChange={e => setEventForm({ ...eventForm, type: e.target.value })}>
                  <option>Interview</option>
                  <option>Deadline</option>
                  <option>Other</option>
                </select>
                <button className="primary-button"><Plus size={16} /> Add Event</button>
              </form>
              {events.length === 0 && <p className="empty-message">No events yet. Add your first event!</p>}
              {[...events].sort((a, b) => a.date.localeCompare(b.date)).map(event => (
                <div key={event.id} style={{ padding: 15, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div><strong>{event.title}</strong><p>{event.type} · {event.date}</p></div>
                  <button className="icon-button" onClick={() => setEvents(prev => prev.filter(e => e.id !== event.id))}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activePage === "Analytics" && (
            <div className="content-grid">
              <section className="panel">
                <h3>Application Status Analytics</h3>
                {[
                  ["Applied", applied, "purple-bar"],
                  ["Interview", interviews, "orange-bar"],
                  ["Selected", selected, "green-bar"],
                  ["Rejected", rejected, "red-bar"]
                ].map(([label, count, color]) => (
                  <div className="progress-item" key={label}>
                    <div className="progress-label"><span>{label}</span><strong>{count}</strong></div>
                    <div className="progress-track">
                      <div className={`progress-fill ${color}`}
                        style={{ width: `${applications.length ? count / applications.length * 100 : 0}%` }} />
                    </div>
                  </div>
                ))}
              </section>
              <section className="panel">
                <h3>Success Overview</h3>
                <div className="overview-total">
                  <h2>{applications.length ? Math.round(selected / applications.length * 100) : 0}%</h2>
                  <span>Selection rate</span>
                </div>
                <p>{applications.length} total applications tracked.</p>
              </section>
            </div>
          )}

          {activePage === "Notifications" && (
            <section className="panel">
              <h3>Notifications & Reminders</h3>
              {events.length === 0 ? <p className="empty-message">No upcoming reminders. Add events in Calendar.</p> :
                events.map(event => (
                  <p key={event.id} style={{ padding: 15, borderBottom: "1px solid #eee" }}>
                    <Bell size={15} /> {event.title} — {event.date}
                  </p>
                ))}
            </section>
          )}

          {activePage === "Resume Manager" && (
            <section className="panel">
              <h3>Resume Manager</h3>
              <p className="subtitle">Select a PDF resume to keep it available in this browser session.</p>
              <input type="file" accept=".pdf" onChange={e => {
                const file = e.target.files?.[0];
                if (file) alert(`Selected: ${file.name}. Keep your original PDF safely stored too.`);
              }} />
              <p className="subtitle">This simple version selects a file but does not upload it to a server.</p>
            </section>
          )}

          {activePage === "Profile" && (
            <section className="panel">
              <h3>My Student Profile</h3>
              <form onSubmit={e => { e.preventDefault(); alert("Profile saved!"); }}
                style={{ display: "grid", gap: 14, maxWidth: 500, marginTop: 20 }}>
                {[
                  ["name", "Full Name"],
                  ["course", "Course"],
                  ["university", "University"],
                  ["email", "Email"],
                  ["skills", "Skills"]
                ].map(([key, label]) => (
                  <label key={key} style={{ display: "grid", gap: 7 }}>
                    {label}
                    <input value={profile[key]}
                      onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                      style={{ padding: 12, borderRadius: 8, border: "1px solid #ddd" }} />
                  </label>
                ))}
                <button className="primary-button"><Save size={16} /> Save Profile</button>
              </form>
            </section>
          )}
        </section>
      </main>

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <form className="modal" onSubmit={saveApplication} onClick={e => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <h2>{editingId ? "Edit Internship" : "Add Internship"}</h2>
                <p>Manage your internship opportunity.</p>
              </div>
              <button type="button" className="close-button" onClick={() => setShowForm(false)}>
                <X size={21} />
              </button>
            </div>

            <label>Company Name *</label>
            <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" required />

            <label>Job Position *</label>
            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Software Developer Intern" required />

            <label>Location</label>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bengaluru or Remote" />

            <label>Application Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {["Applied", "Interview", "Selected", "Rejected"].map(s => <option key={s}>{s}</option>)}
            </select>

            <button className="primary-button modal-submit" type="submit">
              <Save size={16} /> {editingId ? "Update Internship" : "Save Internship"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
