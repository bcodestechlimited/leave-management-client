import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "./ui/input";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSize?: number;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const FileUpload = ({
  label,
  accept = "*",
  maxSize = 5 * 1024 * 1024,
  register,
  error,
}: FileUploadProps) => {
  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize) {
      toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList[0]) {
      const isValid = validateFile(fileList[0]);
      if (!isValid) e.target.value = ""; // Reset file input on invalid file
    }
    register.onChange(e); // Pass the event to react-hook-form
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">{label}</label>
      <Input
        type="file"
        accept={accept}
        {...register}
        onChange={handleFileChange}
        className="block w-full border rounded-lg p-2"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FileUpload;
