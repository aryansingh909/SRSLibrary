'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  authHeaders: () => Record<string, string>;
  folder?: string;
  label?: string;
  usageLabel?: string;
}

export function ImageUpload({
  value,
  onChange,
  authHeaders,
  folder = 'general',
  label,
  usageLabel,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (uploading) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const headers = authHeaders();
      // Don't include Content-Type for FormData uploads - browser sets it automatically with correct boundary
      const uploadHeaders: Record<string, string> = { Authorization: headers['Authorization'] || headers['authorization'] || '' };

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await res.json();
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group inline-block">
          <img
            src={value}
            alt={label || 'Uploaded image'}
            className="h-32 w-auto max-w-full rounded-lg object-cover border shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" fill="%23ccc"><rect width="200" height="120" fill="%23f0f0f0"/><text x="100" y="65" text-anchor="middle" fill="%23999" font-size="12">Invalid Image</text></svg>';
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white bg-white/20 hover:bg-white/30"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Replace
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white bg-white/20 hover:bg-white/30"
              onClick={handleRemove}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center h-32 w-full max-w-xs rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : 'border-muted-foreground/25 bg-muted/30 hover:border-blue-400 hover:bg-muted/50'
          }`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click or drag to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP</p>
            </>
          )}
        </div>
      )}

      <Input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {usageLabel && (
        <p className="text-xs text-muted-foreground">Used in: {usageLabel}</p>
      )}
    </div>
  );
}

interface ImageUrlInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  usageLabel?: string;
}

export function ImageUrlInput({
  value,
  onChange,
  label,
  usageLabel,
}: ImageUrlInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 items-start">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://images.pexels.com/..."
          className="flex-1"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      {value ? (
        <div className="relative group inline-block">
          <img
            src={value}
            alt={label || 'Image'}
            className="h-32 w-auto max-w-full rounded-lg object-cover border shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" fill="%23ccc"><rect width="200" height="120" fill="%23f0f0f0"/><text x="100" y="65" text-anchor="middle" fill="%23999" font-size="12">Invalid Image</text></svg>';
            }}
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={() => onChange('')}
            >
              <X className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-24 w-full max-w-xs rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30">
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">No image set</p>
          </div>
        </div>
      )}
      {usageLabel && (
        <p className="text-xs text-muted-foreground">Used in: {usageLabel}</p>
      )}
    </div>
  );
}
