import React, { useState, useEffect } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../../services/firebase/config";
import Card from "../../components/common/Card";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import { ScrollText, ShieldCheck, User, Search, RefreshCw, Filter } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "auditLogs"), limit(100));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : new Date(a.timestamp || 0).getTime();
        const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : new Date(b.timestamp || 0).getTime();
        return tB - tA;
      });
      setLogs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== "all" && log.action !== actionFilter) return false;
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchActor = log.actorEmail?.toLowerCase().includes(term) || log.actorName?.toLowerCase().includes(term);
      const matchDetails = JSON.stringify(log.details || {}).toLowerCase().includes(term);
      const matchAction = log.action?.toLowerCase().includes(term);
      return matchActor || matchDetails || matchAction;
    }
    return true;
  });

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "PUBLISH_TEST":
        return "success";
      case "FORCE_SUBMIT_ATTEMPT":
        return "danger";
      case "CREATE_STUDENT":
      case "PROVISION_STAFF":
        return "primary";
      case "UPDATE_STAFF_ROLE":
        return "warning";
      case "BROADCAST_ANNOUNCEMENT":
        return "default";
      default:
        return "primary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Compliance & Security
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            System Audit Logs
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Immutable audit record of administrative actions, test publications, and access events.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-xl text-xs font-semibold text-[#111827] transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" /> Refresh Records
        </button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              icon={Search}
              placeholder="Search by actor email, action, candidate name, or payload..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            options={[
              { value: "all", label: "All Audit Actions" },
              { value: "PUBLISH_TEST", label: "Publish Exam" },
              { value: "FORCE_SUBMIT_ATTEMPT", label: "Force Submit / Reconcile" },
              { value: "CREATE_STUDENT", label: "Provision Student" },
              { value: "PROVISION_STAFF", label: "Provision Staff" },
              { value: "UPDATE_STAFF_ROLE", label: "Update Staff Role" },
              { value: "BROADCAST_ANNOUNCEMENT", label: "Broadcast Notification" }
            ]}
          />
        </div>
      </Card>

      {loading ? (
        <TableSkeleton rows={6} cols={4} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No Audit Records Found"
          description="Administrative operations such as test publications and force submissions are logged automatically here."
        />
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Authoritative Actor</th>
                  <th className="px-4 py-3.5">Operational Details</th>
                  <th className="px-5 py-3.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8FAFC]/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <Badge variant={getActionBadgeColor(log.action)} size="xs">
                        {log.action?.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-[#111827]">
                      <p className="font-semibold">{log.actorEmail || log.actorName || "Administrator"}</p>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        UID: {log.actorUid ? `${log.actorUid.substring(0, 10)}...` : "System"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#64748B] max-w-md">
                      {log.details ? (
                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-2 rounded-lg font-mono text-[11px] text-[#111827] space-y-0.5">
                          {Object.entries(log.details).map(([k, v]) => (
                            <div key={k} className="truncate">
                              <span className="font-bold text-[#2563EB]">{k}:</span> {typeof v === "object" ? JSON.stringify(v) : String(v)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#94A3B8]">No extra payload</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-[#64748B] whitespace-nowrap font-medium">
                      {formatDate(log.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
