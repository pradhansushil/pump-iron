export default function TestimonialCard({ name, testimonial, rating }) {
  return (
    <li>
      <div className="avatar">{name.charAt(0).toUpperCase()}</div>
      <h3>{name}</h3>
      <p>{testimonial}</p>
      <p>{"⭐".repeat(rating)}</p>
    </li>
  );
}
