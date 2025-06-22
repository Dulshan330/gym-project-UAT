import SectionCards from "@/components/SectionCards";
import BarchartComponent from "@/components/BarChartComponent";
import DailyAttendanceChart from "@/components/dailyAttendanceChart";

export default function Dashboard() {
  return (
    <div className="m-6 space-y-10">
      <SectionCards />
      <div className="w-full flex gap-3">
        <div className="w-1/2">
          <DailyAttendanceChart />
        </div>
        <div className="w-1/2">
          <BarchartComponent />
        </div>
      </div>
    </div>
  );
}
