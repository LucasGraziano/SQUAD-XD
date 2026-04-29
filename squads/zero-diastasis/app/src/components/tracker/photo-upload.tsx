'use client';

import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('photo_type', 'front');

      const res = await fetch('/api/progress/photos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir');

      setUploaded(true);
      setTimeout(() => setUploaded(false), 3000);
    } catch {
      setError('No se pudo subir la foto. Intenta de nuevo.');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected after error
      e.target.value = '';
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Camera size={20} className="text-primary" />
          <h2 className="font-heading font-bold text-foreground">Fotos de progreso</h2>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground/60 mb-4">
          Toma fotos de frente y de perfil para ver tu transformación. Solo tú puedes verlas.
        </p>
        {error && (
          <p className="text-sm text-red-500 text-center mb-3">{error}</p>
        )}
        <label className="block">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
          <span className={`inline-flex items-center justify-center w-full gap-2 h-11 px-5 text-base rounded-xl font-body font-semibold transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''} ${uploaded ? 'bg-green-100 text-green-700' : 'bg-secondary text-foreground hover:bg-secondary-300'}`}>
            <Upload size={18} />
            {uploaded ? '¡Foto guardada!' : uploading ? 'Subiendo...' : 'Subir foto'}
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
