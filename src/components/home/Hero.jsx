import { Link } from "react-router-dom";
import { ctaButton, h1Style, textColorWhite } from "../../utils/styles";

const heroImage =
  "https://raw.githubusercontent.com/pradhansushil/gym-app-assets/main/hero-banner.png";

export default function Hero({ onBookTour }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 text-center">
        <h1
          id="hero-title"
          className={`${h1Style} text-3xl sm:text-4xl md:text-4xl lg:text-5xl`}
        >
          Pump & Iron
        </h1>
        <p className={`${textColorWhite} text-lg mb-6`}>
          Train Hard, Live Strong
        </p>
        <div className="flex gap-4 justify-center">
          <Link className={ctaButton} to="/signup">
            Join Now
          </Link>
          <button className={ctaButton} onClick={() => onBookTour()}>
            Book a Tour
          </button>
        </div>
      </div>
    </section>
  );
}
