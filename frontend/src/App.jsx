
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

const App = () => {
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

  // Control the visibility of the posting form
  const [showPostForm, setShowPostForm] = useState(false);

  // Post internship states
  const [company, setCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [applicationLink, setApplicationLink] = useState("");
  const [posting, setPosting] = useState(false);
  const [postMessage, setPostMessage] = useState("");

  // Load the six most recent internships
  const loadRecentJobs = async () => {
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

  // Load internships when the page first opens
  useEffect(() => {
    loadRecentJobs();
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

  // Save a new internship through the backend API
  const postInternship = async (event) => {
    event.preventDefault();

    if (!company.trim() || !newRole.trim() || posting) return;

    setPosting(true);
    setPostMessage("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: company.trim(),
          role: newRole.trim(),
          postedBy: postedBy.trim() || "student",
          deadline: deadline || null,
          description: description.trim() || null,
          applicationLink: applicationLink.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post internship");
      }

      const newJob = await response.json();

      setPostMessage("Internship posted successfully!");

      // Add the new job to matching search results
      if (
        searched &&
        newJob.role.toLowerCase().includes(role.trim().toLowerCase())
      ) {
        setJobs((previousJobs) => [newJob, ...previousJobs]);
      }

      // Clear the form after a successful submission
      setCompany("");
      setNewRole("");
      setPostedBy("");
      setDeadline("");
      setDescription("");
      setApplicationLink("");

      // Close the form after the internship is posted
      setShowPostForm(false);

      // Refresh the recent internship cards
      await loadRecentJobs();
    } catch (err) {
      console.error("Post error:", err);
      setPostMessage("Failed to post internship. Please try again.");
    } finally {
      setPosting(false);
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
      {/* Website header */}
      <header>
        <h1>Tracker</h1>
        <p>Help students to find their internship opportunities</p>
      </header>

      <Navbar />

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

        {/* Internship posting section */}
        <section className="post-section">
          <h2>Share an Internship Opportunity</h2>

          <p>
            Found an internship opportunity?
            Share it with other students!
          </p>

          {/* Toggle the posting form */}
          <button
            type="button"
            className="post-toggle-button"
            onClick={() => {
              setShowPostForm((previous) => !previous);
              setPostMessage("");
            }}
            aria-expanded={showPostForm}
            aria-controls="internship-post-form"
            disabled={posting}
          >
            {showPostForm ? "Cancel" : "+ Post Internship"}
          </button>

          {/* Show the form only when the button is clicked */}
          {showPostForm && (
            <form
              id="internship-post-form"
              className="post-form"
              onSubmit={postInternship}
            >
              {/* Required internship information */}
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Job Title"
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Posted By (optional)"
                value={postedBy}
                onChange={(event) => setPostedBy(event.target.value)}
              />

              {/* Optional internship details */}
              <label htmlFor="deadline">
                Application Deadline
              </label>

              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(event) => setDeadline(event.target.value)}
              />

              <textarea
                placeholder="Job Description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />

              <input
                type="url"
                placeholder="Application Link (optional)"
                value={applicationLink}
                onChange={(event) => setApplicationLink(event.target.value)}
              />

              {/* Submit the internship to the backend */}
              <button
                type="submit"
                disabled={
                  posting ||
                  !company.trim() ||
                  !newRole.trim()
                }
              >
                {posting ? "Posting..." : "Submit Internship"}
              </button>
            </form>
          )}

          {/* Display the result of the submission */}
          {postMessage && (
            <p role="status">{postMessage}</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;