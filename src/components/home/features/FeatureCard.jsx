import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  cardStyle,
  h3Heading,
  textColor,
  textSizeSmall,
} from "../../../utils/styles";

export default function FeatureCard({ icon, title, description }) {
  return (
    <li className={`${cardStyle} text-center`}>
      <FontAwesomeIcon
        icon={icon}
        size="2x"
        className="text-blue-400"
        aria-hidden="true"
      />
      <h3 className={h3Heading}>{title}</h3>
      <p className={`${textColor} ${textSizeSmall}`}>{description}</p>
    </li>
  );
}
