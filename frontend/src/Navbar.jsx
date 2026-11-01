import "./Navbar.css";

const Navbar = () => {
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
      </div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/internships">Internships</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;