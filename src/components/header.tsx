import { House } from "lucide-react";
import Link from "next/link";
export default function Header() {
  return (
    <header className="sticky w-full z-50 top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 p-4 items-center lg:hidden">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-white">
          <span className="sr-only">Home</span>
          <House className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
}
