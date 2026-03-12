import { plans } from "../../../data/plansData";
import MembershipPlanCard from "./MembershipPlanCard";

export default function MembershipPlans() {
  return (
    <section aria-labelledby="membership-plans-heading">
      <h2 id="membership-plans-heading">Plans</h2>
      <ul>
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
