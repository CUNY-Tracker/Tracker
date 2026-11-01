import "./App.css";
import Navbar from "./Navbar";

const App = () => {
  
  return (
    <div>
      <header>
        <h1>Welcome to Trackers!</h1>
        <p className="motto">Help students find their <br/> internship opportunities.</p>
      </header>
      <Navbar />

      <hr/>

      <main>
        <nav>
        </nav>

        <h2>Find <span class="underlined">Your</span> Internship.</h2>

        <div className="search">
          <input type="text" placeholder="Search for internships..." />
          <button>Search</button>
        </div>

        <h2>Or, look at the several our community has posted.</h2>
        <p>(they would go here)</p>
      </main>
    </div>
  );
}

export default App;