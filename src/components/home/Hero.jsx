import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <h1 id="hero-title">Pump & Iron</h1>
      <p>Train Hard, Live Strong</p>
      <div className="cta-buttons">
        <Link to="/signup">Join Now</Link>
        <Link to="/tour">Get a Tour</Link>
      </div>
    </section>
  );
}
