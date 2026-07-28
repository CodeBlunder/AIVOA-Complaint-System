// src/components/AITools/RiskAssessment.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { AlertTriangle, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

const RISK_COLORS = {
  Critical: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  Major: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', badge: 'bg-yellow-100 text-yellow-700' },
  Minor: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
};

export default function RiskAssessment() {
  const { riskAssessment, loading } = useSelector(s => s.ai);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
        <div className="h-3 bg-gray-200 rounded mb-2 w-full" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
      </div>
    );
  }

  if (!riskAssessment) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-5 text-center text-sm text-gray-400">
        <ShieldAlert size={32} className="mx-auto mb-2 opacity-30" />
        Risk assessment will appear here after AI processing.
      </div>
    );
  }

  const level = riskAssessment.risk_level || riskAssessment.severity || 'Minor';
  const colors = RISK_COLORS[level] || RISK_COLORS.Minor;

  return (
    <div className={`rounded-xl border p-5 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <ShieldAlert size={18} className={colors.text} />
          AI Risk Assessment
        </h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.badge}`}>
          {level}
        </span>
      </div>

      {/* Risk Score Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-500">Risk Score</span>
          <span className={`font-bold ${colors.text}`}>{riskAssessment.risk_score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              level === 'Critical' ? 'bg-red-500' :
              level === 'Major' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${riskAssessment.risk_score}%` }}
          />
        </div>
      </div>

      {/* Summary */}
      {riskAssessment.ai_summary && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">AI Summary</p>
          <p className="text-sm text-gray-700">{riskAssessment.ai_summary}</p>
        </div>
      )}

      {/* Root Cause */}
      {riskAssessment.root_cause_suggestion && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Root Cause Suggestion</p>
          <p className="text-sm text-gray-700">{riskAssessment.root_cause_suggestion}</p>
        </div>
      )}

      {/* CAPA */}
      {riskAssessment.capa_recommendation && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">CAPA Recommendation</p>
          <p className="text-sm text-gray-700">{riskAssessment.capa_recommendation}</p>
        </div>
      )}

      {/* Key Concerns */}
      {riskAssessment.key_concerns?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-gray-500 mb-1">Key Concerns</p>
          <ul className="space-y-1">
            {riskAssessment.key_concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 text-sm text-gray-700">
                <AlertTriangle size={12} className={`mt-0.5 ${colors.text}`} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Regulatory */}
      <div className={`flex items-center gap-2 text-sm mt-3 pt-3 border-t ${colors.border}`}>
        {riskAssessment.regulatory_reportable ? (
          <><AlertTriangle size={14} className="text-red-600" />
          <span className="text-red-600 font-medium">Regulatory reporting required</span></>
        ) : (
          <><CheckCircle size={14} className="text-green-600" />
          <span className="text-green-600">Not regulatory reportable</span></>
        )}
      </div>
    </div>
  );
}