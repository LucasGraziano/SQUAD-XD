'use client';

import { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function PhotoUpload() {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photo_type', 'front');

    await fetch('/api/progress/photos', {
      method: 'POST',
      body: formData,
    });

    setUploading(false);
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
        <label className="block">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            className="hidden"
          />
          <span className="inline-flex items-center justify-center w-full gap-2 h-11 px-5 text-base rounded-xl font-body font-semibold bg-secondary text-foreground hover:bg-secondary-300 transition-colors cursor-pointer">
            <Upload size={18} />
            {uploading ? 'Subiendo...' : 'Subir foto'}
          </span>
        </label>
      </CardContent>
    </Card>
  );
}
