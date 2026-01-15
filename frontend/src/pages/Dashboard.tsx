import { useEffect, useState } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
type TabType = "scheduled" | "sent";
interface JwtPayload {
  userId: string;
  email: string;
  exp: number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // 🔹 Decode user from JWT
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  const user = token ? (jwtDecode(token) as JwtPayload) : null;

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const saved = localStorage.getItem("activeTab");
    return (saved as TabType) || "scheduled";
  });

  const [userProfile, setUserProfile] = useState<{
  name: string;
  email: string;
  avatar_url: string | null;
} | null>(null);

  const [search, setSearch] = useState("");

  // 🔹 Counts from backend
  const [scheduledCount, setScheduledCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  // 🔹 Axios config (LOCAL, no separate file)
  const api = axios.create({
    baseURL: "http://localhost:4000",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ✅ Persist tab on refresh
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
  async function fetchProfile() {
    try {
      const res = await axios.get(
        "http://localhost:4000/auth/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUserProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  }

  fetchProfile();
}, []);


  // 🔹 Fetch counts on load
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [scheduledRes, sentRes] = await Promise.all([
          api.get("/scheduled"),
          api.get("/sent"),
        ]);

        setScheduledCount(scheduledRes.data.length);
        setSentCount(sentRes.data.length);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
          }
        } else {
          console.error("Unexpected error", err);
        }
      }
    }

    fetchCounts();
  }, []);

  // ✅ Refresh handler
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFilter = () => {
    alert("Filter feature coming soon 🙂");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-2xl font-bold mb-6">ONG</h1>

        {/* 🔹 User from JWT */}
        <div className="flex items-center gap-3 mb-6 rounded-lg bg-gray-50 p-3">
          <img
            src={
              userProfile?.avatar_url ??
              "https://ui-avatars.com/api/?name=User"
            }
            className="h-10 w-10 rounded-full"
            alt="User"
          />
          <div>
            <p className="text-sm font-medium">
              {user?.email.split("@")[0]}
            </p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Compose */}
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
            {scheduledCount}
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
            {sentCount}
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
