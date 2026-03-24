import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faStar } from "@fortawesome/free-solid-svg-icons";

import {
  cardStyle,
  h3Heading,
  marginBottomSm,
  textColor,
} from "../../../utils/styles";

export default function TestimonialCard({ name, testimonial, rating }) {
  return (
    <li className={cardStyle}>
      <div className="text-xl text-blue-400 mb-4">
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <p className={`${textColor} mb-8`}>{testimonial}</p>
      <div
        aria-label={`rating: ${rating} out of 5 stars`}
        className={`flex gap-1 text-yellow-400 ${marginBottomSm}`}
      >
        {Array.from({ length: rating }).map((_, index) => (
          <FontAwesomeIcon key={index} icon={faStar} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-bold text-sm">
          {name.charAt(0).toUpperCase()}
        </div>
        <h3 className={h3Heading}>{name}</h3>
      </div>
    </li>
  );
}
