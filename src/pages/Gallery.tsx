import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface GarageImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  price?: number; // Add price field
}

const Gallery = () => {
  const [images, setImages] = useState<GarageImage[]>([]);
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    // Publiczna galeria nie wymaga uwierzytelnienia, więc nie sprawdzamy sesji
    fetchImages();
  }, []);

  // Funkcja pozostawiona dla kompatybilności, ale nie jest używana w publicznej galerii
  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return null;
    }
  };

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('garage_images')
      .select('*') // Selects all columns, including the new price
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return;
    }

    setImages(data || []);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Unsere Garagen-Galerie</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{image.title}</h3>
              <p className="text-gray-600 mb-4">{image.description}</p>
              {image.price && (
                <p className="text-lg font-medium text-green-600">Cena: {image.price.toFixed(2)} zł</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;