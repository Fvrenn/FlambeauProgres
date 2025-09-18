import React from "react";
import { Gallery, DocumentText } from "@solar-icons/react";

interface FileUploaderProps {
  uploadedFiles: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

const getFileIcon = (file: File) => {
  if (file.type.startsWith("image/")) {
    return <Gallery size={20} color="#6366f1" />;
  } else if (file.type === "application/pdf") {
    return <DocumentText size={20} color="#dc2626" />;
  }
  return <DocumentText size={20} color="#6b7280" />;
};

export default function FileUploader({ 
  uploadedFiles, 
  onFileUpload, 
  onRemoveFile 
}: FileUploaderProps) {
  return (
    <section>
      <h3 className="font-medium text-base mb-4">
        Fichiers justificatifs
      </h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Gallery
            size={48}
            color="#9ca3af"
            className="mx-auto mb-4"
          />
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium"
            >
              Choisir des fichiers
            </label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={onFileUpload}
              className="hidden"
            />
          </div>
          <p className="text-sm text-gray-500">
            Glissez-déposez vos fichiers ici ou cliquez pour
            sélectionner
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Formats acceptés : Images (JPG, PNG), PDF, Documents
            Word
          </p>
        </div>
      </div>

      {/* Liste des fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-3">
            Fichiers sélectionnés :
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}