import { useAuth } from "../../context/AuthContext";
import { memberLinks, publicLinks } from "../../data/linksData";

export default function PageLinks() {
  const { userRole } = useAuth();

  const links = userRole === "member" ? memberLinks : publicLinks;

  return (
    <section aria-labelledby="navigation-links">
      <h3 id="navigation-links">Links</h3>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
