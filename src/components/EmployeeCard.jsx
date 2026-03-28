import { h2Heading, textColor, textSizeSmall } from "../utils/styles";

export default function EmployeeCard({ img, name, specialization, bio }) {
  return (
    <li className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden flex flex-col">
      <img
        src={img}
        alt={name}
        className="w-full h-64 object-cover object-top"
      />
      <div className="p-4">
        <h2 className={`${h2Heading} text-center mb-1`}>{name}</h2>
        <p className={`${textColor} text-center mb-2`}>{specialization}</p>
        <p className={`${textSizeSmall} ${textColor}`}>{bio}</p>
      </div>
    </li>
  );
}
