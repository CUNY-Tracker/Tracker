import { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

const App = () => {
  const [role, setRole] = useState("")
  const [jobs, setJobs] = useState([])

  async function search(){
    try {
    const response = await fetch(
      "http://localhost:5001/api/jobs/" + encodeURIComponent(role)
    );
    if (!response.ok) {
      console.log("Server error:", response.status);
      return;
    }
    const data = await response.json();
    setJobs(data);
  } catch (error) {
    console.log(error);
  }
  }
  

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
          <input type="text" onChange={(e)=>setRole(e.target.value)} placeholder="Search for internships..." />
          <button onClick={()=>search()}>Search</button>
        </div>

        <h2>Or, look at the several our community has posted.</h2>
        <p>(they would go here)</p>
        {jobs.map((job)=>{
          return (
            <div key={job.id}>
              <h1>{job.company}</h1>
              ///add role
            </div>
          )
        })}
      </main>
    </div>
  );
}

export default App;