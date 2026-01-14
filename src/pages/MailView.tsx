// import { useParams, useNavigate } from "react-router-dom";
// import { emails } from "../data/emails";

// export default function MailView() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const mail = emails.find((m) => m.id === Number(id));

//   if (!mail) {
//     return <div className="p-10">Mail not found</div>;
//   }

//   return (
//     <div className="flex h-screen flex-col bg-white">
//       {/* 🔝 Top Header */}
//       <div className="flex items-center justify-between border-b px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-xl hover:text-green-600"
//           >
//             ←
//           </button>

//           <h1 className="text-xl font-semibold">
//             {mail.subject} | MJWYT44 BM#52W01
//           </h1>
//         </div>

//         <div className="flex items-center gap-6 text-gray-500">
//           <span className="cursor-pointer text-xl">☆</span>
//           <span className="cursor-pointer text-xl">🗑️</span>
//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-9 w-9 rounded-full"
//           />
//         </div>
//       </div>

//       {/* ✉️ Mail Content */}
//       <div className="flex-1 overflow-auto p-10">
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white font-semibold">
//               {mail.to.charAt(0)}
//             </div>

//             <div>
//               <p className="font-medium">{mail.to}</p>
//               <p className="text-sm text-gray-400">to me</p>
//             </div>
//           </div>

//           <p className="text-sm text-gray-400">
//             Nov 3, 10:23 AM
//           </p>
//         </div>

//         <div className="max-w-3xl whitespace-pre-line text-gray-700 leading-relaxed">
//           {mail.body}
//         </div>
//       </div>
//     </div>
//   );
// }



// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";  
// import { emails } from "../data/emails";


// export default function MailView() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const mail = emails.find((m) => m.id === Number(id));
//   const [isStarred, setIsStarred] = useState(mail?.starred ?? false);

// const handleStar = () => {
//   setIsStarred((prev) => !prev);
// };

// const handleDelete = () => {
//   alert("Mail deleted (mock)");
//   navigate(-1); // go back after delete
// };

// const handleProfileClick = () => {
//   alert("Profile clicked (future menu)");
// };


//   if (!mail) {
//     return <div className="p-10">Mail not found</div>;
//   }

//   const senderName = mail.to;
//   const senderEmail = "sender@example.com"; // later from backend
//   const avatarLetter = senderName.charAt(0).toUpperCase();

//   return (
//     <div className="flex h-screen flex-col bg-white">
//       {/* 🔝 Top Header */}
//       <div className="flex items-center justify-between border-b px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="text-xl text-gray-600 hover:text-green-600"
//           >
//             ←
//           </button>

//           <h1 className="text-xl font-semibold text-gray-900">
//             {mail.subject} | MJWYT44 BM#52W01
//           </h1>
//         </div>

//         <div className="flex items-center gap-5 text-gray-400">
//           <button className="text-xl hover:text-yellow-500">☆</button>
//           <button className="text-xl hover:text-red-500">🗑️</button>

//           <div className="h-9 w-[1px] bg-gray-300" />

//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-9 w-9 rounded-full object-cover"
//           />
//         </div>
//       </div>

//       {/* ✉️ Mail Content */}
//       <div className="flex-1 overflow-auto px-10 py-8">
//         {/* Sender Header */}
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-start gap-4">
//             {/* Avatar */}
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
//               {avatarLetter}
//             </div>

//             {/* Sender Info */}
//             <div className="flex flex-col">
//               <div className="flex items-center gap-2">
//                 <p className="text-base font-semibold text-gray-900">
//                   {senderName}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   &lt;{senderEmail}&gt;
//                 </p>
//               </div>

//               <div className="flex items-center gap-1 text-sm text-gray-500">
//                 <span>to me</span>
//                 <span className="cursor-pointer">⌄</span>
//               </div>
//             </div>
//           </div>

//           {/* Date */}
//           <p className="text-sm text-gray-500">
//             Nov 3, 10:23 AM
//           </p>
//         </div>

//         {/* Mail Body */}
//         <div className="max-w-4xl whitespace-pre-line text-gray-700 leading-relaxed">
//           {mail.body}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { emails } from "../data/emails";

export default function MailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const mail = emails.find((m) => m.id === Number(id));
  const [isStarred, setIsStarred] = useState(mail?.starred ?? false);

  if (!mail) {
    return <div className="p-10">Mail not found</div>;
  }

  const senderName = mail.to;
  const senderEmail = "sender@example.com"; // later from backend
  const avatarLetter = senderName.charAt(0).toUpperCase();

  // ⭐ Toggle star
  const handleStar = () => {
    setIsStarred((prev) => !prev);
  };

  // 🗑️ Delete mail
  const handleDelete = () => {
    alert("Mail deleted (mock)");
    navigate(-1);
  };

  // 👤 Profile click
  const handleProfileClick = () => {
    alert("Profile clicked (future menu)");
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* 🔝 Top Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-xl text-gray-600 hover:text-green-600"
            title="Back"
          >
            ←
          </button>

          <h1 className="text-xl font-semibold text-gray-900">
            {mail.subject} | MJWYT44 BM#52W01
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* ⭐ Star */}
          <button
            onClick={handleStar}
            className={`text-2xl transition ${
              isStarred
                ? "text-yellow-500"
                : "text-gray-400 hover:text-yellow-500"
            }`}
            title="Star"
          >
            {isStarred ? "⭐" : "☆"}
          </button>

          {/* 🗑️ Delete */}
          <button
            onClick={handleDelete}
            className="text-2xl text-gray-400 transition hover:text-red-500"
            title="Delete"
          >
            🗑️
          </button>

          <div className="h-9 w-[1px] bg-gray-300" />

          {/* 👤 Profile */}
          <button onClick={handleProfileClick} title="Profile">
            <img
              src="https://i.pravatar.cc/40"
              className="h-9 w-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-green-400"
            />
          </button>
        </div>
      </div>

      {/* ✉️ Mail Content */}
      <div className="flex-1 overflow-auto px-10 py-8">
        {/* Sender Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-lg font-semibold text-white">
              {avatarLetter}
            </div>

            {/* Sender Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-900">
                  {senderName}
                </p>
                <p className="text-sm text-gray-500">
                  &lt;{senderEmail}&gt;
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>to me</span>
                <span className="cursor-pointer">⌄</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <p className="text-sm text-gray-500">Nov 3, 10:23 AM</p>
        </div>

        {/* Mail Body */}
        <div className="max-w-4xl whitespace-pre-line text-gray-700 leading-relaxed">
          {mail.body}
        </div>
      </div>
    </div>
  );
}
