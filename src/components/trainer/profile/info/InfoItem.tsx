
interface InfoItemProps {
  label: string;
  value: string;
}

export const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  );
};
