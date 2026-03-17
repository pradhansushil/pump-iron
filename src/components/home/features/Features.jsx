import { featuresData } from "../../../data/featuresData";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section aria-labelledby="features-heading" className="features">
      <h2 id="features-heading">Why Join Us?</h2>
      <ul>
        {featuresData.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </ul>
    </section>
  );
}
