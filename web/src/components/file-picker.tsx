import React, { useEffect, useRef, useState } from 'react';
import { Camera, FileText, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface PreviewFile {
  name: string;
  url: string;
  type: string;
  size: number;
  error: string | null;
}

interface PhotoVideoUploaderProps {
  onChange: (files: Array<File> | null) => void;
  value?: Array<File> | null;
  errors?: Array<{ message?: string } | undefined>;
  accept?: string;
  multiple?: boolean;
  max?: number;
  validateFile?: (file: File) => string | null;
}

const formatFileSize = (bytes: number, decimalPoint: number = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimalPoint < 0 ? 0 : decimalPoint;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function FilePicker({
  onChange,
  value,
  errors,
  accept,
  max,
  validateFile,
  multiple = false,
}: PhotoVideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFiles, setCurrentFiles] = useState<Array<File>>([]);
  const [previews, setPreviews] = useState<Array<PreviewFile>>([]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  useEffect(() => {
    if (!value || value.length === 0) {
      setPreviews([]);
      setCurrentFiles([]);
      return;
    }
  }, [value]);

  const processFiles = (files: Array<File>) => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));

    const newPreviews: Array<PreviewFile> = files.map((file) => {
      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        error: validateFile ? validateFile(file) : null,
      };
    });

    setPreviews(newPreviews);
    setCurrentFiles(files);
    onChange(files);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newlySelectedFiles = event.target.files;

    let remainingSlots = undefined;
    if (multiple && max) {
      remainingSlots = Math.max(0, max - currentFiles.length);
    }

    if (newlySelectedFiles && newlySelectedFiles.length > 0) {
      const newFilesArray = Array.from(newlySelectedFiles);

      const combinedFiles = [
        ...currentFiles,
        ...newFilesArray.slice(0, remainingSlots),
      ];

      processFiles(combinedFiles);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = currentFiles.filter(
      (_, index) => index !== indexToRemove,
    );

    processFiles(updatedFiles);
  };

  const handleRemoveAllFiles = () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPreviews([]);
    setCurrentFiles([]);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const FileListItem: React.FC<{ file: PreviewFile; index: number }> = ({
    file,
    index,
  }) => {
    const isImageOrVideo =
      file.type.startsWith('image/') || file.type.startsWith('video/');

    return (
      <>
        <div
          className={cn([
            'flex items-center justify-between p-3 border-b last:border-b-0',
            file.error ? 'bg-destructive/15 border border-destructive/25' : '',
          ])}
        >
          <div className="w-full flex items-center space-x-4 overflow-hidden">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-gray-100 dark:bg-gray-800">
              {isImageOrVideo ? (
                <img
                  src={file.url}
                  alt={`Preview ${file.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="grow min-w-0 overflow-hidden">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
              {file.error && (
                <p className="text-xs text-destructive mt-1">{file.error}</p>
              )}
            </div>
          </div>

          <Button
            onClick={() => handleRemoveFile(index)}
            variant="ghost"
            size="icon"
            type="button"
            className="h-8 w-8 ml-4 shrink-0 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };

  return (
    <Field className="w-full shadow-lg bg-white rounded-lg">
      <div className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
        <FieldLabel>Adicione Fotos/Vídeos</FieldLabel>
        <span className="text-sm text-muted-foreground">( Opcional )</span>
      </div>

      <FieldContent className="p-4 space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          className="hidden"
          max={max}
        />

        <Button
          onClick={handleButtonClick}
          className="flex items-center space-x-2"
          type="button"
          disabled={
            (!multiple && currentFiles.length >= 1) ||
            (max !== undefined && currentFiles.length >= max)
          }
        >
          <Camera className="h-4 w-4" />
          <span>Selecionar Imagens</span>
        </Button>

        {previews.length > 0 && (
          <div className="border rounded-lg divide-y">
            {previews.map((file, index) => (
              <FileListItem key={file.url} file={file} index={index} />
            ))}
          </div>
        )}

        {errors && errors.length > 0 && <FieldError errors={errors} />}
      </FieldContent>

      {multiple && previews.length > 0 && (
        <div className="p-4 pt-0">
          <Button
            onClick={handleRemoveAllFiles}
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            type="button"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover todos os arquivos
          </Button>
        </div>
      )}
    </Field>
  );
}
