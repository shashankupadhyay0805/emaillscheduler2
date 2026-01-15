import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onFilter: () => void;
}

export default function Header({
  search,
  onSearchChange,
  onRefresh,
  onFilter,
}: HeaderProps) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
        <FiSearch className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={onFilter}
        className="rounded-full p-2 hover:bg-gray-100"
        title="Filter"
      >
        <FiFilter size={18} />
      </button>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        className="rounded-full p-2 hover:bg-gray-100"
        title="Refresh"
      >
        <FiRefreshCw size={18} />
      </button>
    </div>
  );
}



