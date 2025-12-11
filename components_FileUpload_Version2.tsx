import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-aviation-300 rounded-2xl bg-aviation-50 hover:bg-aviation-100 transition-colors cursor-pointer p-12 flex flex-col items-center justify-center text-center group"
    >
      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
        <UploadCloud className="w-10 h-10 text-aviation-600" />
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload your Pairing CSV</h3>
      <p className="text-slate-500 mb-6 max-w-sm">
        Drag and drop your monthly schedule file here, or click to browse.
      </p>
      <label className="relative">
        <span className="bg-aviation-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-aviation-700 transition-colors shadow-md hover:shadow-lg cursor-pointer">
          Select File
        </span>
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
      </label>
      <p className="mt-4 text-xs text-slate-400">Supported format: .csv</p>
    </div>
  );
};

export default FileUpload;