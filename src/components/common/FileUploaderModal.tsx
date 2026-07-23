import React, { useState } from 'react';
import { Upload, FileJson, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface FileUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJsonLoaded: (jsonContent: string, fileName: string) => void;
}

export const FileUploaderModal: React.FC<FileUploaderModalProps> = ({
  isOpen,
  onClose,
  onJsonLoaded,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!file.name.endsWith('.json')) {
      setErrorMsg('El archivo debe tener formato JSON (.json)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          setErrorMsg('El JSON debe contener un arreglo de registros telemáticos');
          return;
        }

        setSuccessMsg(`¡${file.name} cargado correctamente! (${parsed.length} registros)`);
        setTimeout(() => {
          onJsonLoaded(text, file.name);
          onClose();
        }, 1200);
      } catch (err) {
        setErrorMsg('Error al analizar la estructura del JSON. Verifique la validez del sintaxis.');
      }
    };

    reader.readAsText(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          position: 'relative',
          background: 'rgba(18, 24, 38, 0.95)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <FileJson size={26} color="var(--apple-blue-light)" />
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Cargar dataset Rivertech</h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '22px' }}>
          Arrastra y suelta tu archivo JSON de exportación telemática de Rivertech o haz clic para explorar.
        </p>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${
              isDragging ? 'var(--apple-blue)' : 'var(--border-glass-bright)'
            }`,
            borderRadius: '16px',
            padding: '36px 20px',
            textAlign: 'center',
            background: isDragging ? 'rgba(0, 113, 227, 0.08)' : 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <input
            type="file"
            accept=".json"
            onChange={onFileInputChange}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
            }}
          />

          <Upload
            size={40}
            color="var(--apple-blue-light)"
            style={{ marginBottom: '12px', opacity: isDragging ? 1 : 0.8 }}
          />
          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
            Arrastra tu archivo JSON aquí
          </h4>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Soporta exportaciones telemáticas de flotas fluviales y terrestres
          </span>
        </div>

        {errorMsg && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 59, 48, 0.15)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              color: '#ff8080',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(52, 199, 89, 0.15)',
              border: '1px solid rgba(52, 199, 89, 0.3)',
              color: '#70e08b',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
