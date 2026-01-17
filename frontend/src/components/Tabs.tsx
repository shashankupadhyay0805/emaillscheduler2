import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Email {
  id: string;
  recipient_email: string;
  subject: string;
  scheduled_at?: string;
  sent_at?: string;
  status: "scheduled" | "sent";
}

interface TabsProps {
  activeTab: "scheduled" | "sent";
  search: string;
}

export default function Tabs({ activeTab, search }: TabsProps) {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchEmails() {
      if (!token) {
        navigate("/");
        return;
      }

      setLoading(true);

      try {
        const res = await axios.get(
          `https://emaillscheduler2.onrender.com/${activeTab}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEmails(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          }
        } else {
          console.error("Unexpected error", err);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, [activeTab]);

  const filteredEmails = useMemo(() => {
    const query = search.toLowerCase();

    return emails.filter((mail) =>
      mail.recipient_email.toLowerCase().includes(query) ||
      mail.subject.toLowerCase().includes(query)
    );
  }, [emails, search]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        Loading emails...
      </div>
    );
  }

  if (filteredEmails.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        No emails found
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      {filteredEmails.map((mail) => {
        const time =
          activeTab === "scheduled"
            ? mail.scheduled_at
            : mail.sent_at;

        return (
          <div
            key={mail.id}
            onClick={() => navigate(`/mail/${mail.id}`)}
            className="flex cursor-pointer items-center justify-between border-b px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                To: {mail.recipient_email}
              </p>

              <div className="flex items-center gap-3 text-sm">
                {/* Status badge */}
                {activeTab === "scheduled" ? (
                  <span className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                    ⏰ {time ? new Date(time).toLocaleString() : ""}
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Sent
                  </span>
                )}

                <span className="font-medium text-gray-800">
                  {mail.subject}
                </span>
              </div>
            </div>

            <span className="text-xl text-gray-300">☆</span>
          </div>
        );
      })}
    </div>
  );
}
