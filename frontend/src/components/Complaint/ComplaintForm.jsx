import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateFormField,
  createComplaint,
  updateComplaint,
  setFormData,
} from '../../store/slices/complaintSlice';
import toast from 'react-hot-toast';
import { Save, RotateCcw, Database } from 'lucide-react';


const SOURCES     = ['Email', 'Phone Call', 'Customer Portal', 'Field Rep', 'Regulatory Body', 'Other'];
const TYPES       = ['Quality Defect', 'Packaging Issue', 'Efficacy Concern', 'Safety/ADR', 'Labeling Error', 'Contamination', 'Other'];
const SEVERITIES  = ['Critical', 'Major', 'Minor'];
const PRIORITIES  = ['Urgent', 'High', 'Medium', 'Low'];
const STATUSES    = ['Open', 'Under Investigation', 'Pending CAPA', 'Closed'];


const STATUS_BADGE = {
  Open:                 'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Under Investigation':'bg-blue-100 text-blue-700 border-blue-300',
  'Pending CAPA':       'bg-purple-100 text-purple-700 border-purple-300',
  Closed:               'bg-green-100 text-green-700 border-green-300',
};


function SectionHeader({ number, title }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-xs font-bold text-indigo-600">{number}.</span>
      <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{title}</span>
      <div className="flex-1 h-px bg-indigo-100 ml-1" />
    </div>
  );
}


function Field({ label, field, type = 'text', options = null, form, onChange, unit = null, required = false }) {
  const placeholder = 'Awaiting AI extraction...';
  const base = `w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm
    placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400
    focus:border-indigo-400 transition-colors bg-white`;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {options ? (
        <select
          value={form[field] || ''}
          onChange={e => onChange(field, e.target.value)}
          className={`${base} ${!form[field] ? 'text-gray-300' : 'text-gray-800'}`}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={form[field] || ''}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${base} resize-none text-gray-800`}
        />
      ) : unit ? (
        
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
          <input
            type={type}
            value={form[field] || ''}
            onChange={e => onChange(field, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 focus:outline-none bg-white text-gray-800"
          />
          <span className="px-3 text-xs font-semibold text-gray-400 bg-gray-50 border-l border-gray-200 py-2.5">
            {unit}
          </span>
        </div>
      ) : (
        <input
          type={type}
          value={form[field] || ''}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          className={`${base} text-gray-800`}
        />
      )}
    </div>
  );
}

export default function ComplaintForm({ isEdit = false }) {
  const dispatch = useDispatch();
  const form     = useSelector(s => s.complaints.currentComplaint) || {};

  const handleChange = (field, value) => dispatch(updateFormField({ field, value }));

  const handleReset = () => {
    dispatch(setFormData({}));
    toast('Form reset.', { icon: '🔄' });
  };

  const handleSave = async () => {
    if (!form.product_name && !form.complainant_name) {
      toast.error('Please fill at least product name or customer name before saving.');
      return;
    }
    try {
      if (isEdit && form.id) {
        await dispatch(updateComplaint({ id: form.id, data: form })).unwrap();
        toast.success('Complaint updated successfully!');
      } else {
        await dispatch(createComplaint(form)).unwrap();
        toast.success('Complaint logged successfully!');
      }
    } catch {
      toast.error('Failed to save. Check backend connection.');
    }
  };

  
  const currentStatus = form.status || 'Open';
  const badgeClass    = STATUS_BADGE[currentStatus] || STATUS_BADGE['Open'];

  const fp = { form, onChange: handleChange };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Customer Complaint' : 'Log Customer Complaint'}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">API &amp; FDF Quality Assurance Module</p>
          </div>
          <div className="flex items-center gap-3">
            {form.complaint_number && (
              <span className="text-xs font-mono text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded">
                {form.complaint_number}
              </span>
            )}
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${badgeClass}`}>
              {isEdit ? currentStatus : 'Pending Triage'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Form body ──────────────────────────────────────────── */}
      <div className="px-8 py-6 space-y-8">

        {/* SECTION 1 — Origin & Customer Details */}
        <div>
          <SectionHeader number="1" title="Origin & Customer Details" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Complaint Source"  field="source"            options={SOURCES}  required {...fp} />
            <Field label="Customer Name"     field="complainant_name"  required           {...fp} />
            <Field label="Customer Company"  field="complainant_company"                  {...fp} />
            <Field label="Customer Email"    field="complainant_email" type="email"       {...fp} />
            <Field label="Customer Phone"    field="complainant_phone"                    {...fp} />
            <Field label="Date Received"     field="date_received"     type="date"        {...fp} />
          </div>
        </div>

        {/* SECTION 2 — Product & Batch Identification */}
        <div>
          <SectionHeader number="2" title="Product & Batch Identification" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Product Name"          field="product_name"       required {...fp} />
            <Field label="Product Strength/Grade" field="product_strength"           {...fp} />
            <Field label="Batch/Lot Number"       field="batch_number"       required {...fp} />
            <Field label="Manufacturing Date"     field="manufacturing_date" type="date" {...fp} />
            <Field label="Expiry Date"            field="expiry_date"        type="date" {...fp} />
            <Field label="Quantity Affected"      field="quantity_affected"  unit="kg"  {...fp} />
          </div>
        </div>

        {/* SECTION 3 — Complaint Details */}
        <div>
          <SectionHeader number="3" title="Complaint Details" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Complaint Type"  field="category"      options={TYPES} required {...fp} />
            <Field label="Complaint Date"  field="date_received" type="date"              {...fp} />
            <div className="col-span-2">
              <Field label="Detailed Complaint Description" field="description" type="textarea" required {...fp} />
            </div>
          </div>
        </div>

        {/* SECTION 4 — Initial Assessment & Priority */}
        <div>
          <SectionHeader number="4" title="Initial Assessment & Priority" />
          <div className="grid grid-cols-2 gap-5">
            <Field label="Initial Severity" field="severity" options={SEVERITIES} required {...fp} />
            <Field label="Priority"         field="priority" options={PRIORITIES}          {...fp} />
            <Field label="Assigned To"      field="assigned_to"                            {...fp} />
            <Field label="Status"           field="status"   options={STATUSES}            {...fp} />
          </div>
        </div>

      </div>

      {/* ── Footer buttons ─────────────────────────────────────── */}
      <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-white hover:border-gray-400 transition-colors"
        >
          <RotateCcw size={14} />
          Reset Form
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-7 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
        >
          <Database size={14} />
          {isEdit ? 'Update Complaint' : 'Save Complaint'}
        </button>
      </div>
    </div>
  );
}
