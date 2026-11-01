import "./App.css";

function App() {
  return (
    <div className="app">
      <main className="hero">
        <p className="hero-label">BUILT FOR CUNY STUDENTS</p>

        <h1>
          Find your next <span>opportunity.</span>
        </h1>

        <p className="hero-description">
          Explore internships, discover companies, and keep your
          applications organized in one place.
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by role, company, or location"
          />
          <button type="button">Search Jobs</button>
        </div>
      </main>
    </div>
  );
}

export default App;