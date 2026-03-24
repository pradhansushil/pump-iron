import { plans } from "../../../data/plansData";
import { containerStyle, textColorWhite } from "../../../utils/styles";
import MembershipPlanCard from "./MembershipPlanCard";

export default function MembershipPlans() {
  return (
    <section
      aria-labelledby="membership-plans-heading"
      className={containerStyle}
    >
      <h2
        id="membership-plans-heading"
        className={`text-3xl font-bold text-center ${textColorWhite}`}
      >
        Plans
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none mt-6">
        {plans.map((plan) => (
          <MembershipPlanCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            description={plan.description}
            recommended={plan.recommended}
          />
        ))}
      </ul>
    </section>
  );
}
