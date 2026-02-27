import { featuresData } from "../../../data/featuresData";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section aria-labelledby="features">
      <h2 id="features">Why Join Us?</h2>
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
    </section>
  );
}
