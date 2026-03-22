import {
  capitalizeFirstLetter,
  h2Heading,
  cardStyle,
  textColor,
  textColorWhite,
  textSizeSmall,
} from "../../utils/styles";

export default function MembershipCard({ membershipPlan, status }) {
  return (
    <div className={cardStyle}>
      <section aria-labelledby="membership-header">
        <h2 id="membership-header" className={h2Heading}>
          Membership Status
        </h2>
        <div className="flex flex-col gap-2">
          <p
            className={`${capitalizeFirstLetter} ${textSizeSmall} ${textColor}`}
          >
            {membershipPlan}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full mx-auto ${textSizeSmall} font-semibold ${textColorWhite} ${status === "active" ? "bg-green-600" : "bg-red-600"}`}
          >
            {status}
          </span>
        </div>
      </section>
    </div>
  );
}
