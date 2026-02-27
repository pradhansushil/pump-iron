import { featuresData } from "../../../data/featuresData";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <ul>
      {featuresData.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </ul>
  );
}
