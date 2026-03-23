import { Link } from "react-router-dom";
import {
  cardStyle,
  textColor,
  textSizeSmall,
  ctaButton,
} from "../../../utils/styles";

export default function MembershipPlanCard({
  name,
  price,
  description,
  recommended,
}) {
  return (
    <li className={`${cardStyle} relative flex flex-col`}>
      {/* Recommended Badge */}
      {recommended && (
        <span className="text-blue-400 text-xs font-semibold text-right block mb-1">
          Recommended
        </span>
      )}

      {/* Price + Plan Name Row */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-white font-bold text-2xl">{price}</p>
        <h3 className="bg-gray-700 text-blue-400 font-bold text-sm px-8 py-2 rounded-l-full -mr-6">
          {name}
        </h3>
      </div>

      {/* Description */}
      <p className={`${textColor} ${textSizeSmall} flex-1`}>{description}</p>

      {/* CTA */}
      <Link
        to="/signup"
        state={{ plan: name }}
        className={`${ctaButton} block text-center w-full mt-6`}
      >
        Get Started
      </Link>
    </li>
  );
}
