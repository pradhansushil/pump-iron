import { cardStyle, formLabel, textColor } from "../../utils/styles";

export default function StatCard({ label, value }) {
  return (
    <div className={cardStyle}>
      <p className={`${formLabel} ${textColor}`}>{label}</p>
      <span className={`text-3xl font-bold text-blue-400`}>{value}</span>
    </div>
  );
}
