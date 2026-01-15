import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Mail {
  id: string;
  recipient_email: string;
  subject: string;
  body: string;
  status: "scheduled" | "sent";
  scheduled_at?: string;
  sent_at?: string;
}

export default function MailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [mail, setMail] = useState<Mail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false); // UI-only

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchMail() {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4000/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMail(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMail();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-gray-400">Loading email...</div>;
  }

  if (!mail) {
    return <div className="p-10">Mail not found</div>;
  }

  const senderName = mail.recipient_email.split("@")[0];
  const avatarLetter = senderName.charAt(0).toUpperCase();
  const time =
    mail.status === "scheduled"
      ? mail.scheduled_at
      : mail.sent_at;

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 🔝 Top Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xl text-gray-600 hover:text-green-600"
          >
            ←
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            {mail.subject}
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* ⭐ Star (UI only) */}
          <button
            onClick={() => setIsStarred((p) => !p)}
            className={`text-2xl ${
              isStarred
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            }`}
          >
            {isStarred ? "⭐" : "☆"}
          </button>

          {/* 🗑️ Delete (UI only) */}
          <button
            onClick={() => {
              alert("Delete coming soon");
              navigate(-1);
            }}
            className="text-2xl text-gray-400 hover:text-red-500"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* ✉️ Mail Content */}
      <div className="flex-1 overflow-auto px-10 py-8">
        {/* Sender Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
              {avatarLetter}
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                {senderName}
              </p>
              <p className="text-sm text-gray-500">
                &lt;{mail.recipient_email}&gt;
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            {time ? new Date(time).toLocaleString() : ""}
          </p>
        </div>

        {/* Body */}
        <div className="max-w-4xl whitespace-pre-line text-gray-700 leading-relaxed">
          {mail.body}
        </div>
      </div>
    </div>
  );
}
