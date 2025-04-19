import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface GarageImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

const AdminGallery = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GarageImage[]>([]);
  const [newImage, setNewImage] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    checkAuth();
    fetchImages();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('garage_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return;
    }

    setImages(data || []);
  };

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { error } = await supabase
      .from('garage_images')
      .insert([newImage]);

    if (error) {
      console.error('Error adding image:', error);
      return;
    }

    setNewImage({ title: '', description: '', image_url: '' });
    fetchImages();
  };

  const handleDeleteImage = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Galerie verwalten</h1>
        <div className="flex space-x-4">
          <Link to="/admin/orders" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Bestellungen verwalten
          </Link>
        </div>
      </div>

      {/* Add new image form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Neues Bild hinzufügen</h2>
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titel
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
              Beschreibung
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
              Bild-URL
            </label>
            <input
              type="url"
              value={newImage.image_url}
              onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Hinzufügen
          </button>
        </form>
      </div>

      {/* Existing images */}
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
                  <p className="text-gray-600">{image.description}</p>
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

export default AdminGallery;