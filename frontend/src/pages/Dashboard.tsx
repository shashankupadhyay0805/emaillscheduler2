// import { Navigate } from "react-router-dom";
// import { useAuth } from "../auth/useAuth";

// export default function Dashboard() {
//   const { user, logout } = useAuth();

//   if (!user) return <Navigate to="/" />;

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="flex items-center justify-between bg-white p-4 shadow">
//         <div className="flex items-center gap-3">
//           <img
//             src={user.picture}
//             className="h-10 w-10 rounded-full"
//             alt="avatar"
//           />
//           <div>
//             <p className="font-medium">{user.name}</p>
//             <p className="text-sm text-gray-500">{user.email}</p>
//           </div>
//         </div>

//         <button
//           onClick={logout}
//           className="rounded bg-red-500 px-4 py-2 text-white"
//         >
//           Logout
//         </button>
//       </header>

//       <main className="p-6 text-lg font-medium">
//         Dashboard loaded ✅
//       </main>
//     </div>
//   );
// }


// import Header from "../components/Header";
// import Tabs from "../components/Tabs";

// export default function Dashboard() {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-4">
//         <h1 className="text-2xl font-bold mb-6">ONG</h1>

//         {/* User */}
//         <div className="flex items-center gap-3 mb-6">
//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-10 w-10 rounded-full"
//           />
//           <div>
//             <p className="text-sm font-medium">Oliver Brown</p>
//             <p className="text-xs text-gray-400">oliver.brown@domain.io</p>
//           </div>
//         </div>

//         {/* Compose Button */}
//         <button className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50">
//           Compose
//         </button>

//         {/* Menu */}
//         <div className="space-y-2">
//           <div className="flex items-center justify-between rounded-md bg-green-50 px-3 py-2 text-green-700">
//             <span>Scheduled</span>
//             <span className="text-xs bg-green-200 px-2 rounded-full">12</span>
//           </div>

//           <div className="flex items-center justify-between rounded-md px-3 py-2 text-gray-600 hover:bg-gray-100 cursor-pointer">
//             <span>Sent</span>
//             <span className="text-xs bg-gray-200 px-2 rounded-full">785</span>
//           </div>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 flex flex-col">
//         <Header />
//         <Tabs />
//       </main>
//     </div>
//   );
// }


// import { useState } from "react";
// import Header from "../components/Header";
// import Tabs from "../components/Tabs";

// type TabType = "scheduled" | "sent";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<TabType>("scheduled");

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-4">
//         <h1 className="text-2xl font-bold mb-6">ONG</h1>

//         {/* User */}
//         <div className="flex items-center gap-3 mb-6 rounded-lg bg-gray-50 p-3">
//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-10 w-10 rounded-full"
//           />
//           <div>
//             <p className="text-sm font-medium">Oliver Brown</p>
//             <p className="text-xs text-gray-400">oliver.brown@domain.io</p>
//           </div>
//         </div>

//         {/* Compose Button */}
//         <button className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50">
//           Compose
//         </button>

//         {/* Core */}
//         <p className="mb-2 text-xs text-gray-400">CORE</p>

//         <div className="space-y-2">
//           {/* Scheduled */}
//           <button
//             onClick={() => setActiveTab("scheduled")}
//             className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//               activeTab === "scheduled"
//                 ? "bg-green-50 text-green-700"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <span>Scheduled</span>
//             <span className="text-xs bg-green-200 px-2 rounded-full">12</span>
//           </button>

//           {/* Sent */}
//           <button
//             onClick={() => setActiveTab("sent")}
//             className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//               activeTab === "sent"
//                 ? "bg-green-50 text-green-700"
//                 : "text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             <span>Sent</span>
//             <span className="text-xs bg-gray-200 px-2 rounded-full">785</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 flex flex-col">
//         <Header />
//         <Tabs activeTab={activeTab} />
//       </main>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Tabs from "../components/Tabs";

// type TabType = "scheduled" | "sent";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<TabType>(() => {
//     const saved = localStorage.getItem("activeTab");
//     return (saved as TabType) || "scheduled";
//   });

//   // ✅ Persist tab on change
//   useEffect(() => {
//     localStorage.setItem("activeTab", activeTab);
//   }, [activeTab]);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-4">
//         <h1 className="text-2xl font-bold mb-6">ONG</h1>

//         {/* User */}
//         <div className="flex items-center gap-3 mb-6 rounded-lg bg-gray-50 p-3">
//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-10 w-10 rounded-full"
//           />
//           <div>
//             <p className="text-sm font-medium">Oliver Brown</p>
//             <p className="text-xs text-gray-400">
//               oliver.brown@domain.io
//             </p>
//           </div>
//         </div>

//         {/* Compose */}
//         <button className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50">
//           Compose
//         </button>

//         <p className="mb-2 text-xs text-gray-400">CORE</p>

//         {/* Scheduled */}
//         <button
//           onClick={() => setActiveTab("scheduled")}
//           className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//             activeTab === "scheduled"
//               ? "bg-green-50 text-green-700"
//               : "text-gray-600 hover:bg-gray-100"
//           }`}
//         >
//           <span>Scheduled</span>
//           <span className="text-xs bg-green-200 px-2 rounded-full">12</span>
//         </button>

//         {/* Sent */}
//         <button
//           onClick={() => setActiveTab("sent")}
//           className={`mt-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//             activeTab === "sent"
//               ? "bg-green-50 text-green-700"
//               : "text-gray-600 hover:bg-gray-100"
//           }`}
//         >
//           <span>Sent</span>
//           <span className="text-xs bg-gray-200 px-2 rounded-full">785</span>
//         </button>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 flex flex-col">
//         <Header />
//         <Tabs activeTab={activeTab} />
//       </main>
//     </div>
//   );
// }






// import { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Tabs from "../components/Tabs";
// import { useNavigate } from "react-router-dom";

// type TabType = "scheduled" | "sent";

// export default function Dashboard() {
//   const [activeTab, setActiveTab] = useState<TabType>(() => {
//     const saved = localStorage.getItem("activeTab");
//     return (saved as TabType) || "scheduled";
//   });

//   const [search, setSearch] = useState("");

//   // ✅ Persist tab on change
//   useEffect(() => {
//     localStorage.setItem("activeTab", activeTab);
//   }, [activeTab]);

//   // ✅ Refresh handler
//   const handleRefresh = () => {
//     setSearch("");
//     window.location.reload(); // later replace with API refresh
//   };

//   // ✅ Filter handler (future enhancement)
//   const handleFilter = () => {
//     alert("Filter feature coming soon 🙂");
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-4">
//         <h1 className="text-2xl font-bold mb-6">ONG</h1>

//         {/* User */}
//         <div className="flex items-center gap-3 mb-6 rounded-lg bg-gray-50 p-3">
//           <img
//             src="https://i.pravatar.cc/40"
//             className="h-10 w-10 rounded-full"
//           />
//           <div>
//             <p className="text-sm font-medium">Oliver Brown</p>
//             <p className="text-xs text-gray-400">
//               oliver.brown@domain.io
//             </p>
//           </div>
//         </div>

//         {/* Compose */}
//         {/* <button className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50">
//           Compose
//         </button> */}
       
//         <p className="mb-2 text-xs text-gray-400">CORE</p>

//         {/* Scheduled */}
//         <button
//           onClick={() => setActiveTab("scheduled")}
//           className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//             activeTab === "scheduled"
//               ? "bg-green-50 text-green-700"
//               : "text-gray-600 hover:bg-gray-100"
//           }`}
//         >
//           <span>Scheduled</span>
//           <span className="text-xs bg-green-200 px-2 rounded-full">
//             12
//           </span>
//         </button>

//         {/* Sent */}
//         <button
//           onClick={() => setActiveTab("sent")}
//           className={`mt-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
//             activeTab === "sent"
//               ? "bg-green-50 text-green-700"
//               : "text-gray-600 hover:bg-gray-100"
//           }`}
//         >
//           <span>Sent</span>
//           <span className="text-xs bg-gray-200 px-2 rounded-full">
//             785
//           </span>
//         </button>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 flex flex-col bg-white">
//         <Header
//           search={search}
//           onSearchChange={setSearch}
//           onRefresh={handleRefresh}
//           onFilter={handleFilter}
//         />

//         <Tabs activeTab={activeTab} search={search} />
//       </main>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import { useNavigate } from "react-router-dom";

type TabType = "scheduled" | "sent";

export default function Dashboard() {
  const navigate = useNavigate(); // ✅ Navigation enabled

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem("activeTab");
    return (saved as TabType) || "scheduled";
  });

  const [search, setSearch] = useState("");

  // ✅ Persist tab on refresh
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // ✅ Refresh handler
  const handleRefresh = () => {
    setSearch("");
    window.location.reload(); // later replace with API refresh
  };

  // ✅ Filter handler (future enhancement)
  const handleFilter = () => {
    alert("Filter feature coming soon 🙂");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-2xl font-bold mb-6">ONG</h1>

        {/* User */}
        <div className="flex items-center gap-3 mb-6 rounded-lg bg-gray-50 p-3">
          <img
            src="https://i.pravatar.cc/40"
            className="h-10 w-10 rounded-full"
            alt="User"
          />
          <div>
            <p className="text-sm font-medium">Oliver Brown</p>
            <p className="text-xs text-gray-400">
              oliver.brown@domain.io
            </p>
          </div>
        </div>

        {/* ✅ Compose Button */}
        <button
          onClick={() => navigate("/compose")}
          className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50 transition"
        >
          Compose
        </button>

        <p className="mb-2 text-xs text-gray-400">CORE</p>

        {/* Scheduled */}
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
            activeTab === "scheduled"
              ? "bg-green-50 text-green-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>Scheduled</span>
          <span className="text-xs bg-green-200 px-2 rounded-full">
            12
          </span>
        </button>

        {/* Sent */}
        <button
          onClick={() => setActiveTab("sent")}
          className={`mt-2 flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition ${
            activeTab === "sent"
              ? "bg-green-50 text-green-700"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>Sent</span>
          <span className="text-xs bg-gray-200 px-2 rounded-full">
            785
          </span>
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col bg-white">
        <Header
          search={search}
          onSearchChange={setSearch}
          onRefresh={handleRefresh}
          onFilter={handleFilter}
        />

        <Tabs activeTab={activeTab} search={search} />
      </main>
    </div>
  );
}
