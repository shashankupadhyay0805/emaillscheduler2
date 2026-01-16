interface MailHeaderProps {
  name: string;
  email: string;
}

export default function MailHeader({ name, email }: MailHeaderProps) {
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-start gap-4 py-4">
      {/* Avatar */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
        {firstLetter}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-gray-900">
            {name}
          </p>
          <p className="text-sm text-gray-500">
            &lt;{email}&gt;
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>to me</span>
          <span className="cursor-pointer">⌄</span>
        </div>
      </div>
    </div>
  );
}
