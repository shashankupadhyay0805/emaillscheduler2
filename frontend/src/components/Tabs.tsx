import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Email {
  id: number;
  to: string;
  subject: string;
  preview: string;
  status: "scheduled" | "sent";
  time: string;
  starred: boolean;
}

const initialEmails: Email[] = [
  // ✅ Scheduled
  {
    id: 1,
    to: "John Smith",
    subject: "Meeting follow-up",
    preview: "Hi John, just wanted to follow up on our meeting...",
    status: "scheduled",
    time: "Tue 9:15 AM",
    starred: false,
  },
  {
    id: 2,
    to: "Olive",
    subject: "Ramit, great to meet you",
    preview: "Hi Olive, just wanted to follow up on our meeting...",
    status: "scheduled",
    time: "Thu 8:15 PM",
    starred: false,
  },

  // ✅ Sent
  {
    id: 3,
    to: "Sarah Wilson",
    subject: "Re: Project Update",
    preview: "Thanks for the update, Sarah. Looks good!",
    status: "sent",
    time: "Mon 6:30 PM",
    starred: true,
  },
  {
    id: 4,
    to: "Support",
    subject: "Issue with login",
    preview: "I am having trouble logging into the dashboard...",
    status: "sent",
    time: "Sun 2:10 PM",
    starred: false,
  },
];

interface TabsProps {
  activeTab: "scheduled" | "sent";
  search: string;
}

export default function Tabs({ activeTab, search }: TabsProps) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const navigate = useNavigate();

  // ⭐ Toggle star
  const toggleStar = (id: number) => {
    setEmails((prev) =>
      prev.map((mail) =>
        mail.id === id ? { ...mail, starred: !mail.starred } : mail
      )
    );
  };

  // 🔍 Filter emails (tab + search)
  const filteredEmails = useMemo(() => {
    return emails.filter((mail) => {
      const matchesTab = mail.status === activeTab;

      const query = search.toLowerCase();
      const matchesSearch =
        mail.to.toLowerCase().includes(query) ||
        mail.subject.toLowerCase().includes(query) ||
        mail.preview.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [emails, activeTab, search]);

  // 📨 Empty state
  if (filteredEmails.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        No emails found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      {filteredEmails.map((mail) => (
        <div
          key={mail.id}
          onClick={() => navigate(`/mail/${mail.id}`)}
          className="flex cursor-pointer items-center justify-between border-b px-6 py-4 hover:bg-gray-50"
        >
          {/* LEFT */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">To: {mail.to}</p>

            <div className="flex items-center gap-3 text-sm">
              {/* 🕒 Time / Status Badge */}
              {mail.status === "scheduled" ? (
                <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                  ⏰ {mail.time}
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  Sent
                </span>
              )}

              {/* Subject */}
              <span className="font-medium text-gray-800">
                {mail.subject}
              </span>

              {/* Preview */}
              <span className="max-w-[420px] truncate text-gray-400">
                - {mail.preview}
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // ⛔ prevent opening mail
              toggleStar(mail.id);
            }}
            className="text-xl transition hover:scale-110"
            title="Star"
          >
            {mail.starred ? "⭐" : "☆"}
          </button>
        </div>
      ))}
    </div>
  );
}
