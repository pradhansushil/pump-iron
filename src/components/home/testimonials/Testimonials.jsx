import { testimonials } from "../../../data/testimonialsData";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="testimonials">
      <h2 id="testimonials-heading">What People Are Saying About Us</h2>
      <ul>
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            image={testimonial.image}
            name={testimonial.name}
            testimonial={testimonial.testimonial}
            rating={testimonial.rating}
          />
        ))}
      </ul>
    </section>
  );
}
