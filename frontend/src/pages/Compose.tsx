import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Compose() {
  const navigate = useNavigate();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  const token = localStorage.getItem("token");

  const handleAttach = (file: File | null) => {
    if (!file) return;
    setAttachment(file);
    alert(`Attached: ${file.name}`);
  };

  const selectPreset = (hoursFromNow: number) => {
    const date = new Date();
    date.setHours(date.getHours() + hoursFromNow);
    setScheduledTime(date.toISOString());
  };

  const cancelSchedule = () => {
    setScheduledTime(null);
    setShowScheduler(false);
  };

  const handleSend = async () => {
    if (!to || !subject || !body) {
      alert("Please fill all fields");
      return;
    }

    if (!token) {
      alert("Not authenticated");
      navigate("/");
      return;
    }

    const recipients = to
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    try {
      await axios.post(
        "http://localhost:4000/schedule",
        {
          senderEmail: "no-reply@ong.app",
          subject,
          body,
          startTime: scheduledTime ?? new Date().toISOString(),
          delayBetweenEmailsSeconds: 2,
          recipients,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        scheduledTime
          ? "Emails scheduled successfully ✅"
          : "Emails sent successfully ✅"
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Failed to schedule emails");
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-xl hover:text-green-600"
            >
              ←
            </button>
            <h1 className="text-xl font-semibold">Compose New Email</h1>
          </div>

          <div className="flex items-center gap-5">
            <label className="cursor-pointer text-xl hover:text-green-600">
              📎
              <input
                type="file"
                hidden
                onChange={(e) =>
                  handleAttach(e.target.files?.[0] ?? null)
                }
              />
            </label>

            <button
              onClick={() => setShowScheduler((p) => !p)}
              className="text-xl hover:text-green-600"
            >
              ⏰
            </button>

            <button
              onClick={handleSend}
              className="rounded-full border border-green-500 px-5 py-1 font-medium text-green-600 hover:bg-green-50"
            >
              Send
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="flex flex-1 gap-8 p-8">
          <div className="flex flex-1 flex-col gap-5">
            <div className="flex gap-4">
              <span className="w-16 text-gray-500">From</span>
              <select className="rounded bg-gray-100 px-3 py-1">
                <option>no-reply@ong.app</option>
              </select>
            </div>

            <div className="flex gap-4">
              <span className="w-16 text-gray-500">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="a@test.com, b@test.com"
                className="flex-1 border-b outline-none"
              />
            </div>

            <div className="flex gap-4">
              <span className="w-16 text-gray-500">Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="flex-1 border-b outline-none"
              />
            </div>

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your email..."
              className="mt-4 flex-1 resize-none rounded-lg border p-4 outline-none"
            />
          </div>

          {/* Scheduler */}
          {showScheduler && (
            <div className="w-80 rounded-xl border bg-white p-5 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold">Send Later</h3>

              <input
                type="datetime-local"
                className="mb-4 w-full rounded border px-3 py-2"
                onChange={(e) =>
                  setScheduledTime(
                    new Date(e.target.value).toISOString()
                  )
                }
              />

              <div className="space-y-2 text-sm">
                <button
                  onClick={() => selectPreset(24)}
                  className="block w-full rounded px-2 py-1 text-left hover:bg-gray-100"
                >
                  Tomorrow
                </button>
                <button
                  onClick={() => selectPreset(10)}
                  className="block w-full rounded px-2 py-1 text-left hover:bg-gray-100"
                >
                  In 10 hours
                </button>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={cancelSchedule}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowScheduler(false)}
                  className="rounded-full border border-green-500 px-4 py-1 text-green-600 hover:bg-green-50"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
