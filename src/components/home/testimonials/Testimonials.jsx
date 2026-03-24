import { testimonials } from "../../../data/testimonialsData";
import {
  containerStyle,
  h1Style,
  marginBottom,
  pageStyle,
  subText,
} from "../../../utils/styles";
import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className={pageStyle}>
      <div className={containerStyle}>
        <div className={`${marginBottom} text-center`}>
          <h2 id="testimonials-heading" className={h1Style}>
            What People Are Saying About Us
          </h2>
          <p className={subText}>Real results from real people.</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </section>
  );
}
