import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import ComplaintForm from '../components/Complaint/ComplaintForm';
import AICopilot from '../components/AITools/AICopilot';
import DocumentUpload from '../components/AITools/DocumentUpload';
import RiskAssessment from '../components/AITools/RiskAssessment';

import { setFormData } from '../store/slices/complaintSlice';
import { clearAIState } from '../store/slices/aiSlice';

import { Wand2, FileText } from 'lucide-react';

const EMPTY_FORM = {
  complainant_name: '',
  complainant_company: '',
  complainant_email: '',
  complainant_phone: '',
  product_name: '',
  batch_number: '',
  manufacturing_date: '',
  expiry_date: '',
  quantity_affected: '',
  date_received: '',
  category: '',
  description: '',
  severity: '',
  assigned_to: '',
  status: 'Open',
  source: 'Manual',
};

export default function LogComplaint() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFormData(EMPTY_FORM));
    dispatch(clearAIState());
  }, [dispatch]);

  return (
    <div className="flex gap-6 h-full">

      <div className="w-80 shrink-0 space-y-4 overflow-y-auto">

        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-blue-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            AI Tools
          </h2>
        </div>

        <AICopilot mode="log" />

        <div className="flex items-center gap-2">
          <div className="flex-1 border-b" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 border-b" />
        </div>

        <DocumentUpload />

        <div className="flex items-center gap-2 mt-4">
          <FileText size={16} className="text-blue-600" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Risk Assessment
          </h2>
        </div>

        <RiskAssessment />

      </div>

      <div className="flex-1 overflow-y-auto">
        <ComplaintForm />
      </div>

    </div>
  );
}