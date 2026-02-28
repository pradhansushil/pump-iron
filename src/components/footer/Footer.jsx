import PageLinks from "./PageLinks";
import SocialMediaLinks from "./SocialMediaLinks";

export default function Footer() {
  return (
    <footer>
      <a href="mailto:info@pumpandiron.com">info@pumpandiron.com</a>
      <PageLinks />
      <SocialMediaLinks />
      <p>&copy; Pump & Iron 2026 </p>
    </footer>
  );
}
