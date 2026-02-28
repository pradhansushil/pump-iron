export default function TestimonialCard({ image, name, testimonial, rating }) {
  return (
    <li>
      <p>{image}</p>
      <h3>{name}</h3>
      <p>{testimonial}</p>
      <p>{rating}</p>
    </li>
  );
}
