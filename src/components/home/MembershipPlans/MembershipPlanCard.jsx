import { Link } from "react-router-dom";

export default function MembershipPlanCard({
  name,
  price,
  description,
  recommended,
}) {
  return (
    <li className="plan-card">
      <Link to="/signup" state={{ plan: name }}>
        <h3>{name}</h3>
        <p>{description}</p>
        {recommended && <span>Recommended</span>}
        <p>{price}</p>
      </Link>
    </li>
  );
}
