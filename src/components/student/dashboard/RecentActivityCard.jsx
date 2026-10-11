import React from "react";
import { Link } from "react-router-dom";
import { Play, Check, BarChart2, Download, ArrowRight, History } from "lucide-react";

export default function RecentActivityCard({ activity = [] }) {
  const displayList = (activity || []).map((item, i) => ({
    id: i,
    title: item.title,
    testTitle: item.testTitle,
    time: item.time,
    icon: item.icon === "play" ? Play : item.icon === "check" ? Check : item.icon === "chart" ? BarChart2 : Download,
    iconBg: item.icon === "play" ? "bg-[#16B866] text-white" : item.icon === "check" ? "bg-[#0866F5] text-white" : item.icon === "chart" ? "bg-[#7547F8] text-white" : "bg-[#EF4444] text-white"
  }));

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-4">
        <h3 className="text-base font-black text-[#111A36]">Recent Activity</h3>
        <Link
          to="/student/history"
          className="text-xs font-bold text-[#0866F5] hover:text-[#0754D1] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Activity Timeline List */}
      {displayList.length === 0 ? (
        <div className="text-center py-8 space-y-2 my-auto">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFD] text-[#94A3B8] flex items-center justify-center mx-auto">
            <History className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-[#111A36]">No recent activity</p>
          <p className="text-[11px] text-[#64748B]">
            Your exam attempts and score notifications will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 my-auto">
          {displayList.slice(0, 4).map((evt) => {
            const Icon = evt.icon;
            return (
              <div key={evt.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${evt.iconBg}`}
                  >
                    <Icon className="w-4 h-4 fill-current" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#111A36] leading-tight truncate">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {evt.testTitle}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-right font-medium text-[#64748B] shrink-0 whitespace-pre-line leading-tight">
                  {evt.time}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
