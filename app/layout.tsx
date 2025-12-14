import '../styles/globals.css';
import Topbar from '../components/Layout/Topbar';
import BottomNav from '../components/Layout/BottomNav';
import Sidebar from '../components/Layout/Sidebar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b1220] text-white">
        <Topbar />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row px-4 pt-20 pb-20 gap-6">
          {/* ✅ Left Sidebar - hide on mobile */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* ✅ Main content expands on mobile */}
          <main className="w-full">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
