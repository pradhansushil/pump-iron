export default function FeatureCard({ icon, title, description }) {
  return (
    <li>
      <span>{icon}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </li>
  );
}
