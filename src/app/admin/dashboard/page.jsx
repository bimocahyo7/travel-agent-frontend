import { SectionCards } from "@/components/section-cards";

export const metadata = {
  title: "Dashboard Admin",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <h1 title="Dashboard Admin" />
      <div className="px-4 lg:px-6">
        <SectionCards />
      </div>
    </div>
  );
}
