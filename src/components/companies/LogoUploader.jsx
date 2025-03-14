// src/app/components/companies/LogoUploader.jsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export const LogoUploader = () => {
  const form = useFormContext();
  const { toast } = useToast();
  const [preview, setPreview] = useState(
    form.watch("configuration.theme.logo") || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validaciones básicas
    if (!file.type.includes("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (SVG, PNG, JPG or GIF)",
      });
      return;
    }

    // Crear preview temporal
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Subir archivo
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        "https://api.nevtis.com/marketplace/files/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = `https://api.nevtis.com/marketplace/files/list/${response.data.key}`;

      form.setValue("configuration.theme.logo", fileUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });

      toast({
        title: "Logo uploaded successfully",
        description: "The logo has been uploaded and saved",
      });
    } catch (error) {
      console.error("Upload error:", error); // Debug log
      toast({
        variant: "destructive",
        title: "Upload failed",
        description:
          error.response?.data?.message ||
          "Failed to upload image. Please try again.",
      });
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    form.setValue("configuration.theme.logo", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    setPreview(null);
    toast({
      description: "Logo has been removed",
    });
  };

  const currentLogo = form.watch("configuration.theme.logo");

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
        <div className="flex flex-col items-center justify-center gap-2">
          {preview ? (
            <div className="relative">
              <Image
                src={preview}
                alt="Logo preview"
                className="max-h-[100px] w-auto object-contain"
                width={100}
                height={100}
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-full bg-brand-primary/10">
                <ImageIcon className="h-8 w-8 text-brand-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">Upload your company logo</p>
                <p className="text-xs text-gray-500">
                  SVG, PNG, JPG or GIF (MAX. 800×400px)
                </p>
              </div>
            </>
          )}

          <input
            type="file"
            id="logo-upload"
            accept="image/*"
            className="sr-only"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="logo-upload"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium",
              "bg-brand-primary text-white hover:bg-brand-primary/90",
              "cursor-pointer transition-colors",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading
              ? "Uploading..."
              : preview
              ? "Change logo"
              : "Select file"}
          </label>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="text-xs text-gray-500 mt-2">
          <p>Current logo URL: {currentLogo || "None"}</p>
        </div>
      )}
    </div>
  );
};
