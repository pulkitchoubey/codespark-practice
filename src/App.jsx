
import { useEffect, useState } from 'react';
import './App.css';

const initialIssues = [
  {
    id: 1,
    title: 'Projector not working',
    category: 'Classroom',
    location: 'Block A, Room 204',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 2,
    title: 'Water cooler needs repair',
    category: 'Facilities',
    location: 'Block B, Ground Floor',
    priority: 'Medium',
    status: 'Open',
  },
];

function App() {
  const [issues, setIssues] = useState(() => {
  try {
    const savedIssues = localStorage.getItem('campusfix-issues');

    if (savedIssues) {
      const parsedIssues = JSON.parse(savedIssues);

      if (Array.isArray(parsedIssues)) {
        return parsedIssues;
      }
    }
  } catch (error) {
    console.error('Could not load saved issues:', error);
  }

  return initialIssues;
});
useEffect(() => {
  localStorage.setItem(
    'campusfix-issues',
    JSON.stringify(issues)
  );
}, [issues]);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Classroom');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  function addIssue(event) {
    event.preventDefault();

    if (!title.trim() || !location.trim()) {
      return;
    }

    const newIssue = {
      id: Date.now(),
      title: title.trim(),
      category,
      location: location.trim(),
      priority,
      status: 'Open',
    };

    setIssues([newIssue, ...issues]);

    setTitle('');
    setLocation('');
    setCategory('Classroom');
    setPriority('Medium');
  }

  function resolveIssue(id) {
    setIssues(
      issues.map((issue) =>
        issue.id === id
          ? { ...issue, status: 'Resolved' }
          : issue
      )
    );
  }

  const visibleIssues = issues.filter((issue) => {
    if (filter === 'All') return true;
    return issue.status === filter;
  });

  const openCount = issues.filter(
    (issue) => issue.status === 'Open'
  ).length;

  const resolvedCount = issues.filter(
    (issue) => issue.status === 'Resolved'
  ).length;

  return (
    <main className="app-shell">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">C</div>
          <span>CampusFix</span>
        </div>

        <span className="header-tag">Campus Issue Management</span>
      </header>

      <section className="welcome">
        <p className="eyebrow">CAMPUS COMMUNITY</p>
        <h1>Let's make our campus better.</h1>
        <p>Report problems. Track progress. Improve your campus.</p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Total issues</span>
          <strong>{issues.length}</strong>
        </div>

        <div className="stat-card">
          <span>Open issues</span>
          <strong>{openCount}</strong>
        </div>

        <div className="stat-card">
          <span>Resolved issues</span>
          <strong>{resolvedCount}</strong>
        </div>
      </section>

      <section className="content">
        <div className="panel form-panel">
          <h2>Report an issue</h2>
          <p className="muted">Tell us what needs attention.</p>

          <form onSubmit={addIssue}>
            <label htmlFor="title">Issue title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Wi-Fi not working"
              required
            />

            <label htmlFor="location">Location</label>
            <input
              id="location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Block A, Room 101"
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Classroom</option>
              <option>Facilities</option>
              <option>Electrical</option>
              <option>Internet</option>
              <option>Other</option>
            </select>

            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button className="submit-button" type="submit">
              + Submit issue
            </button>
          </form>
        </div>

        <div className="panel issues-panel">
          <div className="issues-heading">
            <div>
              <h2>Reported issues</h2>
              <p className="muted">Manage campus complaints.</p>
            </div>
          </div>

          <div className="filters">
            {['All', 'Open', 'Resolved'].map((item) => (
              <button
                key={item}
                className={filter === item ? 'filter active' : 'filter'}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="issue-list">
            {visibleIssues.length === 0 ? (
              <p className="empty">No issues found.</p>
            ) : (
              visibleIssues.map((issue) => (
                <article className="issue-card" key={issue.id}>
                  <div className="issue-top">
                    <span className="category">{issue.category}</span>
                    <span className={`priority ${issue.priority.toLowerCase()}`}>
                      {issue.priority} priority
                    </span>
                  </div>

                  <h3>{issue.title}</h3>
                  <p className="muted">{issue.location}</p>

                  <div className="issue-bottom">
                    <span className={`status ${issue.status.toLowerCase()}`}>
                      {issue.status}
                    </span>

                    {issue.status === 'Open' && (
                      <button
                        className="resolve-button"
                        onClick={() => resolveIssue(issue.id)}
                      >
                        Mark resolved
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
