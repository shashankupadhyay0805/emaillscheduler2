import { useEffect, useMemo, useState } from "react";
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

  const token = localStorage.getItem("token")!;

  const user = useMemo(() => {
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  }, [token]);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    return (localStorage.getItem("activeTab") as TabType) || "scheduled";
  });

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    avatar_url: string | null;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [scheduledCount, setScheduledCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!token) return;

    async function fetchProfile() {
      try {
        const res = await axios.get("https://emaillscheduler2.onrender.com/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    }

    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function fetchCounts() {
      try {
        const [scheduledRes, sentRes] = await Promise.all([
          axios.get("https://emaillscheduler2.onrender.com/scheduled", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://emaillscheduler2.onrender.com/sent", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setScheduledCount(scheduledRes.data.length);
        setSentCount(sentRes.data.length);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          localStorage.removeItem("token");
        } else {
          console.error("Unexpected error", err);
        }
      }
    }

    fetchCounts();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">ONG</h1>

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

        <button
          onClick={() => navigate("/compose")}
          className="w-full mb-6 rounded-full border border-green-500 text-green-600 py-2 font-medium hover:bg-green-50 transition"
        >
          Compose
        </button>

        <p className="mb-2 text-xs text-gray-400">CORE</p>

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

        <button
          onClick={handleLogout}
          className="mt-auto w-full rounded-md border border-red-500 text-red-600 py-2 text-sm font-medium hover:bg-red-50 transition"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 flex flex-col bg-white">
        <Header
          search={search}
          onSearchChange={setSearch}
          onRefresh={() => window.location.reload()}
          onFilter={() => alert("Filter feature coming soon 🙂")}
        />
        <Tabs activeTab={activeTab} search={search} />
      </main>
    </div>
  );
}
