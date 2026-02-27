export default function FeatureCard({ icon, title, description }) {
  return (
    <li>
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </li>
  );
}
