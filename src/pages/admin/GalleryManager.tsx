import React, { useEffect, useState, ChangeEvent } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface GarageImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  price?: number; // Add price field
}

const GalleryManager = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GarageImage[]>([]);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    price: '' // Add price to state, initialize as string for input
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    checkAuth();
    fetchImages();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return null;
      }
      return session;
    } catch (error) {
      console.error('Error checking authentication:', error);
      navigate('/login');
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      alert('Proszę wybrać plik obrazu.');
      return;
    }

    const session = await checkAuth();
    if (!session) return;

    setUploading(true);

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('garage-images') // Make sure this bucket exists and has correct policies
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('garage-images')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Nie udało się uzyskać publicznego URL dla obrazu.');
      }

      const imageUrl = urlData.publicUrl;

      // Insert image metadata into the database
      const { error: insertError } = await supabase
        .from('garage_images')
        .insert([{
          title: newImage.title,
          description: newImage.description,
          image_url: imageUrl, // Use the public URL from storage
          price: newImage.price ? parseFloat(newImage.price) : null,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        throw insertError;
      }

      setNewImage({ title: '', description: '', price: '' }); // Reset form fields
      setImageFile(null); // Reset file input
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = ''; // Clear the file input visually
      fetchImages(); // Refresh the image list
      alert('Zdjęcie dodane pomyślnie!');

    } catch (error: any) {
      console.error('Error adding image:', error);
      alert(`Błąd podczas dodawania zdjęcia: ${error.message}`);
      // Optionally, attempt to delete the uploaded file if DB insert failed
      if (filePath) {
        await supabase.storage.from('garage-images').remove([filePath]);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    const session = await checkAuth();
    if (!session) return;

    const { error } = await supabase
      .from('garage_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting image:', error);
      return;
    }

    fetchImages();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Zarządzanie Galerią</h1>
        <Link
          to="/admin"
          className="flex items-center text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Powrót do panelu
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Dodaj nowe zdjęcie</h2>
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tytuł
            </label>
            <input
              type="text"
              value={newImage.title}
              onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis
            </label>
            <textarea
              value={newImage.description}
              onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plik zdjęcia
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cena (opcjonalnie)
            </label>
            <input
              type="number"
              step="0.01"
              value={newImage.price}
              onChange={(e) => setNewImage({ ...newImage, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Przesyłanie...
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Dodaj
              </>
            )}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{image.title}</h3>
                  <p className="text-gray-600 mb-2">{image.description}</p>
                  {image.price && (
                    <p className="text-lg font-medium text-green-600">Cena: {image.price.toFixed(2)} zł</p>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;