import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FeatureCard({ icon, title, description }) {
  return (
    <li className="feature-card">
      <FontAwesomeIcon icon={icon} size="2x" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
