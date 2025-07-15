import { House } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="no-scrollbar font-semibold text-slate-200 w-full lg:w-64 h-full flex-col hidden lg:flex p-5">
      <div>
        <Link
          href="/"
          className="text-white flex space-x-2 hover:bg-gray-700/20 rounded-lg p-2"
        >
          <House className="w-6 h-6" />
          <span>Home</span>
        </Link>
      </div>
    </aside>
  );
}
