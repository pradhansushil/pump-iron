import PageLinks from "./PageLinks";
import SocialMediaLinks from "./SocialMediaLinks";

export default function Footer() {
  return (
    <footer aria-label="site footer">
      <div className="footer-container">
        <div className="footer-contact">
          <a href="mailto:info@pumpandiron.com">info@pumpandiron.com</a>
          <p>&copy; Pump & Iron 2026 </p>
        </div>
        <PageLinks />
        <SocialMediaLinks />
      </div>
    </footer>
  );
}
