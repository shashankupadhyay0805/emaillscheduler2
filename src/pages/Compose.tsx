// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function Compose() {
//   const navigate = useNavigate();

//   const [to, setTo] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");

//   return (
//     <div className="flex h-screen flex-col bg-white">
//       {/* 🔝 Header */}
//       <div className="flex items-center justify-between border-b px-6 py-4">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-xl text-gray-600 hover:text-green-600"
//           >
//             ←
//           </button>
//           <h1 className="text-xl font-semibold">Compose New Email</h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="text-xl text-gray-400 hover:text-gray-600">
//             📎
//           </button>

//           <button className="text-xl text-gray-400 hover:text-gray-600">
//             🕒
//           </button>

//           <button className="rounded-full border border-green-500 px-5 py-1.5 text-green-600 font-medium hover:bg-green-50">
//             Send
//           </button>
//         </div>
//       </div>

//       {/* ✉️ Form */}
//       <div className="flex flex-1 gap-6 p-8">
//         {/* LEFT FORM */}
//         <div className="flex-1 space-y-6">
//           {/* From */}
//           <div className="flex items-center gap-6">
//             <label className="w-20 text-sm text-gray-500">From</label>
//             <select className="rounded-md bg-gray-100 px-4 py-2 text-sm outline-none">
//               <option>oliver.brown@domain.io</option>
//             </select>
//           </div>

//           {/* To */}
//           <div className="flex items-center gap-6">
//             <label className="w-20 text-sm text-gray-500">To</label>
//             <input
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               placeholder="recipient@example.com"
//               className="flex-1 border-b py-2 outline-none focus:border-green-400"
//             />
//           </div>

//           {/* Subject */}
//           <div className="flex items-center gap-6">
//             <label className="w-20 text-sm text-gray-500">Subject</label>
//             <input
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               placeholder="Subject"
//               className="flex-1 border-b py-2 outline-none focus:border-green-400"
//             />
//           </div>

//           {/* Delay */}
//           <div className="flex items-center gap-6">
//             <label className="text-sm text-gray-500">
//               Delay between 2 emails
//             </label>
//             <input
//               className="w-20 rounded-md border px-3 py-1 text-center"
//               placeholder="00"
//             />

//             <label className="ml-6 text-sm text-gray-500">
//               Hourly Limit
//             </label>
//             <input
//               className="w-20 rounded-md border px-3 py-1 text-center"
//               placeholder="00"
//             />
//           </div>

//           {/* Editor */}
//           <textarea
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             placeholder="Type your reply..."
//             className="h-72 w-full resize-none rounded-md border p-4 outline-none focus:ring-1 focus:ring-green-400"
//           />
//         </div>

//         {/* RIGHT PANEL */}
//         <div className="w-72 rounded-xl border p-4 shadow-sm">
//           <h3 className="mb-4 text-lg font-semibold">Send Later</h3>

//           <input
//             type="datetime-local"
//             className="w-full rounded-md border px-3 py-2 text-sm"
//           />

//           <div className="mt-4 space-y-3 text-sm text-gray-600">
//             <p className="cursor-pointer hover:text-green-600">
//               Tomorrow
//             </p>
//             <p className="cursor-pointer hover:text-green-600">
//               Tomorrow, 10:00 AM
//             </p>
//             <p className="cursor-pointer hover:text-green-600">
//               Tomorrow, 11:00 AM
//             </p>
//             <p className="cursor-pointer hover:text-green-600">
//               Tomorrow, 3:00 PM
//             </p>
//           </div>

//           <div className="mt-6 flex justify-between">
//             <button className="text-sm text-gray-500 hover:text-gray-700">
//               Cancel
//             </button>

//             <button className="rounded-full border border-green-500 px-4 py-1 text-green-600 hover:bg-green-50">
//               Done
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emails } from "../data/emails";
import type { Email } from "../data/emails";

export default function Compose() {
  const navigate = useNavigate();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);

  // 📎 Attachment
  const handleAttach = (file: File | null) => {
    if (!file) return;
    setAttachment(file);
    alert(`Attached: ${file.name}`);
  };

  // ⏰ Preset schedule
  const selectPreset = (label: string) => {
    setScheduledTime(label);
  };

  // ❌ Cancel scheduling
  const cancelSchedule = () => {
    setScheduledTime(null);
    setShowScheduler(false);
  };

  // ✅ Done scheduling
  const confirmSchedule = () => {
    if (!scheduledTime) {
      alert("Please select a time");
      return;
    }
    alert(`Email scheduled for ${scheduledTime}`);
    setShowScheduler(false);
  };

  // ✉️ Send email
  const handleSend = () => {
    if (!to || !subject || !body) {
      alert("Please fill all fields");
      return;
    }

    const newMail: Email = {
      id: Date.now(),
      to,
      subject,
      preview: body.slice(0, 60),
      body,
      status: scheduledTime ? "scheduled" : "sent",
      time: scheduledTime ?? "Just now",
      starred: false,
    };

    emails.unshift(newMail); // mock save
    alert(scheduledTime ? "Email scheduled ✅" : "Email sent ✅");
    navigate("/dashboard");
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
            {/* 📎 Attach */}
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

            {/* ⏰ Schedule */}
            <button
              onClick={() => setShowScheduler((p) => !p)}
              className="text-xl hover:text-green-600"
            >
              ⏰
            </button>

            {/* 🚀 Send */}
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
          {/* Left */}
          <div className="flex flex-1 flex-col gap-5">
            <div className="flex gap-4">
              <span className="w-16 text-gray-500">From</span>
              <select className="rounded bg-gray-100 px-3 py-1">
                <option>oliver.brown@domain.io</option>
              </select>
            </div>

            <div className="flex gap-4">
              <span className="w-16 text-gray-500">To</span>
              <input
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
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
              placeholder="Type your reply..."
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
                onChange={(e) => setScheduledTime(e.target.value)}
              />

              <div className="space-y-2 text-sm">
                {[
                  "Tomorrow",
                  "Tomorrow 10:00 AM",
                  "Tomorrow 11:00 AM",
                  "Tomorrow 3:00 PM",
                ].map((t) => (
                  <button
                    key={t}
                    onClick={() => selectPreset(t)}
                    className="block w-full rounded px-2 py-1 text-left hover:bg-gray-100"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={cancelSchedule}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSchedule}
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


