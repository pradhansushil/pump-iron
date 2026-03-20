import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { memberLinks, publicLinks } from "../../data/linksData";
import { footerHeadingStyle } from "../../utils/styles";

export default function PageLinks() {
  const { userRole } = useAuth();

  const links = userRole === "member" ? memberLinks : publicLinks;

  return (
    <section aria-labelledby="navigation-links" className="footer-nav">
      <h3 className={footerHeadingStyle} id="navigation-links">
        Links
      </h3>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
