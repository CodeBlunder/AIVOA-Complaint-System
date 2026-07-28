import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComplaints, setCurrentComplaint } from '../store/slices/complaintSlice';
import { clearAIState } from '../store/slices/aiSlice';
import ComplaintForm from '../components/Complaint/ComplaintForm';
import AICopilot from '../components/AITools/AICopilot';
import RiskAssessment from '../components/AITools/RiskAssessment';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Badge from '../components/Common/Badge';
import { ArrowLeft, Wand2, FileText } from 'lucide-react';

/**
 * Complaint Detail page – shows existing complaint with edit capability.
 * Same layout as LogComplaint but in 'edit' mode.
 * The AI edit tool can modify specific fields via natural language.
 */
export default function ComplaintDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, currentComplaint } = useSelector(s => s.complaints);

  useEffect(() => {
    // If items not loaded yet, fetch them
    if (items.length === 0) {
      dispatch(fetchComplaints());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    // Once items are loaded, find the one matching the URL id
    const found = items.find(c => c.id === parseInt(id));
    if (found) {
      dispatch(setCurrentComplaint(found));
      dispatch(clearAIState());
    }
  }, [items, id, dispatch]);

  if (loading) return <LoadingSpinner label="Loading complaint..." />;

  if (!currentComplaint) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">Complaint not found.</p>
        <button onClick={() => navigate('/complaints')} className="text-blue-500 text-sm mt-2 hover:underline">
          ← Back to complaints
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back navigation + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/complaints')}
          className="p-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-400">{currentComplaint.complaint_number}</span>
            <Badge type="severity" value={currentComplaint.severity} />
            <Badge type="status" value={currentComplaint.status} />
          </div>
          <p className="text-base font-semibold text-slate-900 mt-0.5">
            {currentComplaint.product_name || 'Unnamed Product'}
          </p>
        </div>
      </div>

      {/* Same two-column layout as LogComplaint */}
      <div className="flex gap-6">
        {/* ── LEFT: AI Edit Tools ──────────────────── */}
        <div className="w-80 shrink-0 space-y-4 overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <Wand2 size={15} className="text-blue-500" />
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              AI Edit Tool
            </h2>
          </div>

          {/* Edit mode passes current complaint data so the AI knows what exists */}
          <AICopilot mode="edit" currentData={currentComplaint} />

          <div className="flex items-center gap-2 mt-2">
            <FileText size={15} className="text-blue-500" />
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Risk Assessment
            </h2>
          </div>
          <RiskAssessment />
        </div>

        {/* ── RIGHT: Edit Form ──────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <ComplaintForm isEdit={true} />
        </div>
      </div>
    </div>
  );
}