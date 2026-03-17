export default function TestimonialCard({ name, testimonial, rating }) {
  return (
    <li className="testimonial-card">
      <div className="avatar">{name.charAt(0).toUpperCase()}</div>
      <h3>{name}</h3>
      <p>{testimonial}</p>
      <p aria-label={`rating: ${rating} out of 5 stars`}>
        {"⭐".repeat(rating)}
      </p>
    </li>
  );
}
