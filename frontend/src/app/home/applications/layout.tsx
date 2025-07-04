import Sidebar from "@/companents/Sidebar";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#f3f2ef] flex flex-col md:flex-row">
      <aside className="w-full md:w-[250px] md:min-h-screen">
        <Sidebar />
      </aside>
      <main className="flex-1 p-4 md:p-8 min-h-screen">
        {children}
      </main>
    </div>
  );
}
