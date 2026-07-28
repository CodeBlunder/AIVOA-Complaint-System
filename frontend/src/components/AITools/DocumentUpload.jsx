// src/components/AITools/DocumentUpload.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { runExtractAgent } from '../../store/slices/aiSlice';
import { setFormData } from '../../store/slices/complaintSlice';
import { Upload, FileText, Image } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentUpload() {
  const dispatch = useDispatch();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    toast.loading('Extracting document...');
    
    try {
      const result = await dispatch(runExtractAgent(formData)).unwrap();
      toast.dismiss();
      
      if (result.form_data) {
        dispatch(setFormData(result.form_data));
        toast.success(`Document extracted! ${Object.keys(result.form_data).filter(k => result.form_data[k]).length} fields filled.`);
      }
    } catch (err) {
      toast.dismiss();
      toast.error('Document extraction failed.');
    }
  }, [dispatch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Upload size={18} className="text-green-600" />
        <h3 className="font-semibold text-gray-800">Document Extraction</h3>
      </div>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center gap-3 mb-2">
          <FileText size={24} className="text-gray-400" />
          <Image size={24} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">
          {isDragActive ? 'Drop the file here...' : 'Drag & drop a complaint document'}
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT, JPG, PNG</p>
      </div>
    </div>
  );
}