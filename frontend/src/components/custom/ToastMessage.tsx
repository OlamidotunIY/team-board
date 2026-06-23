interface ToastMessageProps {
  title: string;
  description?: string;
}

export function ToastMessage({ title, description }: ToastMessageProps) {
  return (
    <div className="space-y-1">
      <h1 className="font-semibold">{title}</h1>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  );
}
