import { plansData } from "../../../data/plansData";
import MembershipPlanCard from "./MembershipPlanCard";

export default function MembershipPlans() {
  return (
    <section aria-labelledby="membership-plans">
      <h2 id="membership-plans">Plans</h2>
      <ul>
        {plansData.map((plan) => (
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
