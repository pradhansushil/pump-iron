import { Link } from "react-router-dom";

export default function Hero({ onBookTour }) {
  return (
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">Pump & Iron</h1>
      <p>Train Hard, Live Strong</p>
      <div className="cta-buttons">
        <Link to="/signup">Join Now</Link>
        <button onClick={() => onBookTour()}>Book a Tour</button>
      </div>
    </section>
  );
}
