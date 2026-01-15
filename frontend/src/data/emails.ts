export interface Email {
  id: number;
  to: string;
  subject: string;
  preview: string;
  body: string;
  status: "scheduled" | "sent";
  time: string;                // Display time label
  starred: boolean;
  scheduledAt?: string;        // ✅ For scheduler (ISO or readable)
  createdAt?: string;          // ✅ For future sorting / backend sync
}

/**
 * ⚠️ Temporary in-memory store.
 * Later this will be replaced by backend APIs.
 */
export let emails: Email[] = [
  {
    id: 1,
    to: "John Smith",
    subject: "Meeting follow-up",
    preview: "Hi John, just wanted to follow up on our meeting...",
    body: `Hey John,

Just following up on our meeting yesterday.
Let me know if Thursday works for you.

Best,
Oliver`,
    status: "scheduled",
    time: "Tue 9:15 AM",
    starred: false,
    scheduledAt: "2026-01-16T09:15:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    to: "Olive",
    subject: "Great meeting you",
    preview: "Ramit, great to meet you — you'll love it...",
    body: `Hi Olive,

Great meeting you today. Looking forward to collaborating.

Cheers`,
    status: "scheduled",
    time: "Thu 8:15 PM",
    starred: false,
    scheduledAt: "2026-01-18T20:15:00",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    to: "Sarah Wilson",
    subject: "Re: Project Update",
    preview: "Thanks for the update, Sarah. Looks good!",
    body: `Hi Sarah,

Thanks for the update — everything looks good from my side.

Regards`,
    status: "sent",
    time: "Mon 6:30 PM",
    starred: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    to: "Support",
    subject: "Issue with login",
    preview: "I am having trouble logging into the dashboard...",
    body: `Hello Support,

I'm unable to login into the dashboard since yesterday.

Please help.

Thanks`,
    status: "sent",
    time: "Sun 2:10 PM",
    starred: false,
    createdAt: new Date().toISOString(),
  },
];

/* ----------------------------
   Helper functions (Mock API)
----------------------------- */

// 🆔 Generate next ID safely
const generateId = () => {
  return emails.length ? Math.max(...emails.map((e) => e.id)) + 1 : 1;
};

// ➕ Add new email
export const addEmail = (mail: Omit<Email, "id">) => {
  const newMail: Email = {
    ...mail,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  emails = [newMail, ...emails];
  return newMail;
};

// ⭐ Toggle star
export const toggleStar = (id: number) => {
  emails = emails.map((mail) =>
    mail.id === id ? { ...mail, starred: !mail.starred } : mail
  );
};

// 🗑 Delete email
export const deleteEmail = (id: number) => {
  emails = emails.filter((mail) => mail.id !== id);
};

// 📩 Get all emails (future API compatibility)
export const getEmails = () => {
  return [...emails]; // return copy (safe)
};

// 🔍 Get single email
export const getEmailById = (id: number) => {
  return emails.find((mail) => mail.id === id);
};
