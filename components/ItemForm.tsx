"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Plus, Trash2, Camera, Tag, DollarSign, FileText } from "lucide-react";
import { siteConfig } from "@/lib/config";
import MediaPreview from "./MediaPreview";

interface ItemFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    media: { type: "image" | "video"; url: string; publicId?: string }[];
    category: string;
  };
  categories: string[];
  onSubmit: (data: unknown) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface MediaPreviewState {
  file: File;
  previewUrl: string;
  type: "image" | "video";
  isNew: boolean;
  publicId?: string;
}

export function ItemForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || categories[0] || "",
    media: initialData?.media || [],
  });
  const [newCategory, setNewCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreviewState[]>([]);
  const [formPrice, setFormPrice] = useState<string>(
    initialData?.price ? initialData.price.toLocaleString() : "0",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing media from initialData into previews
  useEffect(() => {
    if (initialData?.media) {
      const existingPreviews = initialData.media.map((media, index) => ({
        file: new File([], `existing_${index}`),
        previewUrl: media.url,
        type: media.type,
        isNew: false,
        publicId: media.publicId,
      }));
      setMediaPreviews(existingPreviews);
    }
  }, [initialData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      mediaPreviews.forEach((preview) => {
        if (preview.isNew && preview.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const newFormData = {
        ...formData,
        price: formPrice
          ? parseFloat(formPrice.toString().replace(/,/g, ""))
          : 0,
      };
      
      let uploadedMedia: { url: string; type: "image" | "video" }[] = [];

      if (mediaPreviews.length === 0) {
        throw new Error("Please add at least one image or video for your product.");
      }

      const existingMedia = mediaPreviews
        .filter((p) => !p.isNew)
        .map((p) => ({
          url: p.previewUrl,
          type: p.type as "image" | "video",
          publicId: p.publicId,
        }));

      const newMedia: { url: string; type: "image" | "video"; publicId: string }[] = [];

      for (const preview of mediaPreviews) {
        if (preview.isNew) {
          const timestamp = Math.round(new Date().getTime() / 1000);
          const paramsToSign = {
            timestamp,
            folder: "catalog-items",
          };

          const signResponse = await fetch("/api/upload/sign", {
            method: "POST",
            body: JSON.stringify({ paramsToSign }),
          });

          if (!signResponse.ok) throw new Error("Failed to get upload signature");

          const { signature, apiKey, cloudName } = await signResponse.json();

          const uploadFormData = new FormData();
          uploadFormData.append("file", preview.file);
          uploadFormData.append("api_key", apiKey);
          uploadFormData.append("timestamp", timestamp.toString());
          uploadFormData.append("signature", signature);
          uploadFormData.append("folder", "catalog-items");

          const resourceType = preview.type === "video" ? "video" : "image";
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
            {
              method: "POST",
              body: uploadFormData,
            },
          );

          if (!uploadResponse.ok) throw new Error("Failed to upload to Cloudinary");

          const uploadData = await uploadResponse.json();
          newMedia.push({
            url: uploadData.secure_url,
            type: preview.type,
            publicId: uploadData.public_id,
          });
        }
      }

      uploadedMedia = [...existingMedia, ...newMedia];

      await onSubmit({
        ...newFormData,
        media: uploadedMedia,
        category: (formData.category === "__new__" ? newCategory : formData.category) || "all",
      });
    } catch (error: unknown) {
      console.error("Error submitting form:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while saving. Please try again.";
      alert(errorMessage);
      setIsUploading(false);
    }
  };

  const handleMediaSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPreviews: MediaPreviewState[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/"))
        continue;

      const type = file.type.startsWith("video/") ? "video" : "image";
      const previewUrl = URL.createObjectURL(file);
      newPreviews.push({
        file,
        previewUrl,
        type,
        isNew: true,
      });
    }

    setMediaPreviews((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setMediaPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      if (prev[index].isNew && prev[index].previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(prev[index].previewUrl);
      }
      return newPreviews;
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleMediaSelect(e.dataTransfer.files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold-light ml-1">
              <FileText className="w-4 h-4" />
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Signature Suede Loafers"
              className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold-light ml-1">
              <Plus className="w-4 h-4 rotate-45" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Describe the style, material, and comfort..."
              rows={5}
              className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold-light ml-1">
                <DollarSign className="w-4 h-4" />
                Price ({siteConfig.currencySymbol})
              </label>
              <input
                type="text"
                value={formPrice}
                onChange={(e) => {
                  const value = e.target.value.replaceAll(",", "")
                  const valid = !isNaN(parseFloat(value))
                  setFormPrice(() =>
                    valid
                      ? (parseFloat(value).toLocaleString())
                      : "0",
                  );
                }}
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all font-bold"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold-light ml-1">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all appearance-none"
              >
                <option value="all">All Collection</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="__new__">+ Define New Category</option>
              </select>
            </div>
          </div>

          {formData.category === "__new__" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-gold ml-1">
                Custom Category Name
              </label>
              <input
                type="text"
                value={newCategory || ""}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Limited Edition"
                className="w-full px-5 py-3.5 border-2 border-gold/30 rounded-xl bg-gold/5 dark:bg-gold/10 text-chocolate dark:text-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold transition-all"
                required
              />
            </div>
          )}
        </div>

        {/* Right Column: Media */}
        <div className="space-y-6">
          <label className="flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold-light ml-1">
            <Camera className="w-4 h-4" />
            Product Visuals
          </label>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer group ${
              dragActive
                ? "border-gold bg-gold/5 scale-[1.01]"
                : "border-gray-200 dark:border-gold/20 hover:border-gold/50 dark:hover:border-gold/40"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-transform group-hover:-translate-y-1 ${dragActive ? 'text-gold' : 'text-gray-300 dark:text-gold/20'}`} />
            <p className="text-sm font-bold text-chocolate dark:text-gold-light mb-1">
              Drop visuals here
            </p>
            <p className="text-xs text-gray-400 dark:text-gold/40">
              Supports high-quality images and MP4 videos
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={fileInputRef}
              onChange={(e) => handleMediaSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {(isUploading || isLoading) && (
            <div className="flex items-center gap-2 text-gold animate-pulse">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs font-bold uppercase tracking-widest">Processing Gallery...</span>
            </div>
          )}

          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {mediaPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-chocolate border border-gray-100 dark:border-gold/10 shadow-sm"
                >
                  <MediaPreview
                    media={{ type: preview.type, url: preview.previewUrl }}
                    itemName={formData.name}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(index);
                      }}
                      className="p-2 rounded-full bg-red-500 text-white hover:scale-110 transition-transform shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100 dark:border-gold/10">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-4 border border-gray-200 dark:border-gold/20 rounded-2xl text-chocolate dark:text-gold font-bold hover:bg-gray-50 dark:hover:bg-gold/5 transition-all"
          disabled={isLoading || isUploading}
        >
          Discard Changes
        </button>
        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="flex-[2] px-6 py-4 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-2xl font-bold shadow-xl shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isUploading || isLoading ? (
            <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {initialData?._id ? "Update Product" : "Launch Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
