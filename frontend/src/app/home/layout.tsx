import Navbar from "@/companents/Navbar";


export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#e5e5e5] w-[100vw] min-h-full h-[100vh]">
      <Navbar />
      {children}
    </div>
  );
}
