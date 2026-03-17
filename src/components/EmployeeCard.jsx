export default function EmployeeCard({ img, name, specialization, bio }) {
  return (
    <li className="employee-card">
      <img src={img} alt={name} />
      <h2>{name}</h2>
      <p>Position: {specialization}</p>
      <p>{bio}</p>
    </li>
  );
}
