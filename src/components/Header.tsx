import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
      <h1>POOLI</h1>

      <nav style={{ marginTop: "8px" }}>
        <Link to="/" style={{ marginRight: "12px" }}>
          Home
        </Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}
