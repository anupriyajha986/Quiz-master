import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getResultById } from "../../services/firebase/analyticsService";
import ScorecardReport from "../../components/common/ScorecardReport";
import { CardSkeleton } from "../../components/common/LoadingSkeleton";
import EmptyState from "../../components/common/EmptyState";
import { Award } from "lucide-react";

export default function AdminResultDetail() {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      setLoading(true);
      try {
        const data = await getResultById(resultId);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [resultId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!result) {
    return (
      <EmptyState
        icon={Award}
        title="Result Document Not Found"
        description="The requested examination result record does not exist or has been archived."
      />
    );
  }

  return (
    <ScorecardReport
      result={result}
      backUrl="/admin/results"
      isAdmin={true}
    />
  );
}
