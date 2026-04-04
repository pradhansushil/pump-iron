import PageLinks from "./PageLinks";
import SocialMediaLinks from "./SocialMediaLinks";

export default function Footer() {
  return (
    <footer
      className="mt-auto bg-gray-900 px-4 py-6 text-white"
      aria-label="site footer"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:gap-1">
        <div className="footer-contact">
          <a className="text-blue-400" href="mailto:info@pumpandiron.com">
            info@pumpandiron.com
          </a>
          <p>&copy; Pump & Iron 2026 </p>
        </div>
        <PageLinks />
        <SocialMediaLinks />
      </div>
    </footer>
  );
}
