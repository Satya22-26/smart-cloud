import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X, CheckCircle, AlertCircle } from "lucide-react";
import apiClient from '@/lib/apiClient';
import { toast } from "sonner";

function UploadView() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setMessage(null);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const uploadFile = async (force: boolean = false) => {
    if (!selectedFile) return;
    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Add ?force=true to the URL if the user confirmed the override
      const url = force ? '/upload-and-analyze/?force=true' : '/upload-and-analyze/';
      
      const response = await apiClient.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Check for our custom "near_duplicate_found" status
      if (response.data.status === "near_duplicate_found") {
        const confirmUpload = window.confirm(
          `${response.data.message}\n\nIt is ${response.data.similarity_score} similar to "${response.data.similar_to_filename}".\n\nDo you want to upload it anyway?`
        );
        if (confirmUpload) {
          await uploadFile(true);
        } else {
          setUploading(false);
        }
        return;
      }

      toast.success("File uploaded successfully!", {
        description: `${selectedFile.name} has been processed.`
      });
      localStorage.removeItem('dashboard_cache');
      setSelectedFile(null);

    } catch (error: any) {
      console.error("Upload failed:", error);
      const errorMsg = error.response?.data?.detail || "An error occurred during upload.";
      toast.error("Upload Failed", { description: errorMsg });
    } finally {
      // Only turn off loading if we didn't just trigger a forced re-upload
      if (!force) setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-dashed border-2 shadow-sm mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-4xl font-bold text-blue-600 dark:text-blue-400 font-sans">Upload Your Files</CardTitle>
        <CardDescription>Drag and drop files here or click to select</CardDescription>
      </CardHeader>
      <CardContent>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
            {message.text}
          </div>
        )}

        
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg transition-colors cursor-pointer
              ${isDragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-700'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className={`w-16 h-16 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Drag & Drop file here</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">or click to browse</p>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          </div>
        ) : (
          
          <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <File className="w-16 h-16 text-blue-500 mb-4" />
            <p className="font-medium text-lg">{selectedFile.name}</p>
            <p className="text-sm text-gray-500 mb-6">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => { setSelectedFile(null); setMessage(null); }} disabled={uploading}>
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
              <Button onClick={() => uploadFile(false)} disabled={uploading}>
                {uploading ? (
                    <>
                        <UploadCloud className="w-4 h-4 mr-2 animate-bounce" /> Uploading...
                    </>
                ) : (
                    <>
                        <UploadCloud className="w-4 h-4 mr-2" /> Upload File
                    </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UploadView;