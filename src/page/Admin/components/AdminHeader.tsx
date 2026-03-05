interface AdminHeaderProps {
  title: string;
  description: string;
}

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
