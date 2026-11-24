import { Routes, Route, Link } from "react-router-dom";
import Explore from "./pages/Explore";
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import Post from "./pages/Post";

const LegacyHome = () => {
  // Search states
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Recent internship states
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentError, setRecentError] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);

// Load internships when the page first opens
useEffect(() => {
  const fetchRecentJobs = async () => {
    try {
      const response = await fetch("/api/jobs");

      if (!response.ok) {
        throw new Error("Failed to fetch recent internships");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response from backend");
      }

      setRecentJobs(data.slice(0, 6));
      setRecentError("");
    } catch (err) {
      console.error("Recent jobs error:", err);
      setRecentError("Unable to load recent internships.");
    }
  };

  fetchRecentJobs();
}, []);

  // Search internships by job title
  const search = async (event) => {
    event.preventDefault();

    const keyword = role.trim();
    if (!keyword || loading) return;

    setLoading(true);
    setError("");
    setSearched(false);
    setJobs([]);

    try {
      // Encode the search keyword before sending it
      const response = await fetch(
        "/api/jobs/" + encodeURIComponent(keyword)
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid response from backend");
      }

      setJobs(data);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      setError("Unable to load internships. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Expand or collapse an internship card
  const toggleJob = (jobId) => {
    setExpandedJobId((previousId) =>
      previousId === jobId ? null : jobId
    );
  };

  // Render a card with expandable internship details
  const renderJobCard = (job) => (
    <div className="job-card" key={job.id}>
      <button
        type="button"
        className="job-card-header"
        onClick={() => toggleJob(job.id)}
        aria-expanded={expandedJobId === job.id}
      >
        <div>
          <h3>{job.role}</h3>
          <p>{job.company}</p>
          <p>
            Deadline: {job.deadline || "Not provided"}
          </p>
        </div>

        <span>{expandedJobId === job.id ? "−" : "+"}</span>
      </button>

      {/* Show additional details when the card is expanded */}
      {expandedJobId === job.id && (
        <div className="job-card-details">
          <p>
            <strong>Description:</strong>{" "}
            {job.description || "Not provided"}
          </p>

          <p>
            <strong>Posted by:</strong>{" "}
            {job.postedBy || "student"}
          </p>

          {/* Open the external application page */}
          {job.applicationLink && (
            <a
              href={job.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply Here
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <main>
        <h2>Find "your" internship</h2>

        {/* Search form */}
        <form className="search" onSubmit={search}>
          <input
            type="text"
            placeholder="Search for internships..."
            value={role}
            onChange={(event) => setRole(event.target.value)}
          />

          <button
            type="submit"
            disabled={loading || !role.trim()}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p>{error}</p>}
        {loading && <p>Loading internships...</p>}

        {/* Display search results */}
        {searched && (
          <section className="jobs-section">
            <h2>Search Results</h2>

            {jobs.length === 0 ? (
              <p>No internships found.</p>
            ) : (
              <div className="jobs-list">
                {jobs.map(renderJobCard)}
              </div>
            )}
          </section>
        )}

        {/* Display the six most recent internships */}
        <section className="jobs-section">
          <h2>Recent Internships</h2>

          {recentError && <p>{recentError}</p>}

          {recentJobs.length === 0 && !recentError ? (
            <p>No internships posted yet.</p>
          ) : (
            <div className="jobs-list">
              {recentJobs.map(renderJobCard)}
            </div>
          )}
        </section>
        
        {/* Link to the internship posting page */}
        <section className="post-section">
          <h2>Share an Internship Opportunity</h2>

          <p>
            Found an internship opportunity?
            Share it with other students!
          </p>

          <Link to="/post" className="post-toggle-button">
            + Post Internship
          </Link>
        </section>
      </main>
    </div>
  );
};

// Main application with page routing
// Shared layout for all pages
const App = () => {
  return (
    <div>
      <header>
        <h1>Tracker</h1>
        <p>Help students to find their internship opportunities</p>
      </header>

      <Navbar />

      <Routes>
        <Route path="/" element={<LegacyHome />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </div>
  );
};

export default App;