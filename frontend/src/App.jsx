import { useState } from "react";
import "./App.css";

const App = () => {
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const search = async () => {
    if (!role.trim()) return;

    try {
      setError("");
      setSearched(false);

      const response = await fetch(
        "/api/jobs/" + encodeURIComponent(role.trim())
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
      setSearched(true);
    } catch (err) {
      setError("Unable to connect to the backend.");
      setJobs([]);
    }
  };

  return (
    <div>
      <header>
        <h1>Tracker</h1>
        <p>Help students to find their internship opportunities</p>
      </header>

      <main>
        <h2>Find "your" internship</h2>

        <div className="search">
          <input
            type="text"
            placeholder="Search for internships..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <button onClick={search}>Search</button>
        </div>

        {error && <p>{error}</p>}

        {searched && (
          <div>
            <h2>Search Results</h2>

            {jobs.length === 0 ? (
              <p>No internships found.</p>
            ) : (
              jobs.map((job) => (
                <div key={job.id}>
                  <h3>{job.role}</h3>
                  <p>{job.company}</p>
                </div>
              ))
            )}
          </div>
        )}

        <h2>Post Your Information</h2>
        <p>Click here to post your information.</p>
      </main>
    </div>
  );
};

export default App;