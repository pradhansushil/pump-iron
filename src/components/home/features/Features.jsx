import { featuresData } from "../../../data/featuresData";
import { containerStyle, textColorWhite } from "../../../utils/styles";
import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section aria-labelledby="features-heading" className={containerStyle}>
      <h2
        id="features-heading"
        className={`text-2xl font-bold text-center ${textColorWhite}`}
      >
        Why Join Us?
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none mt-6">
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
