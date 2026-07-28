import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runLogAgent, runEditAgent } from '../../store/slices/aiSlice';
import { setFormData } from '../../store/slices/complaintSlice';
import { Wand2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EXAMPLES = [
  "ABC Pharma called about batch B2024-3312 of Metformin 500mg tablets showing discolouration. Contact: john@abcpharma.com. Expiry: Mar 2026.",
  "City Hospital reports Amoxicillin 250mg capsules lot MFG-2024-112 appear underfilled. 200 units affected.",
  "Dr. Patel reports contamination in injectable batch INJ-2024-887 of Cefixime. Visible particles. Critical safety concern."
];

export default function AICopilot({ mode = 'log', currentData = null }) {
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.ai);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    try {
      let result;
      if (mode === 'log') {
        result = await dispatch(runLogAgent(prompt)).unwrap();
      } else {
        result = await dispatch(runEditAgent({
          complaintId: currentData?.id,
          instruction: prompt,
          currentData,
        })).unwrap();
      }
      if (result.form_data) {
        dispatch(setFormData(result.form_data));
        toast.success('Form filled by AI. Please review and save.');
      }
    } catch (err) {
      toast.error('AI processing failed. Try again.');
    }
  };

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 size={18} className="text-blue-600" />
        <h3 className="font-semibold text-gray-800 text-sm">
          {mode === 'log' ? 'AI Log Complaint' : 'AI Edit Complaint'}
        </h3>
      </div>

      {mode === 'log' && (
        <div className="mb-3 flex flex-wrap gap-1">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setPrompt(ex)}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 transition-colors"
            >
              Example {i + 1}
            </button>
          ))}
        </div>
      )}

      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder={
          mode === 'log'
            ? 'Describe the complaint in natural language...'
            : 'Describe what to change e.g. "Set severity to Critical, assign to Dr. Shah"'
        }
        className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !prompt.trim()}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading
          ? <><Loader2 size={15} className="animate-spin" /> Processing...</>
          : <><Wand2 size={15} /> {mode === 'log' ? 'Auto-Fill Form' : 'Apply Edits'}</>
        }
      </button>
    </div>
  );
}
