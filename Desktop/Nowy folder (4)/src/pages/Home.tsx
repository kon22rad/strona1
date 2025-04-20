import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Timer, PenTool as Tool } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1621189426246-d3f9f33f85d9?auto=format&fit=crop&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">Hochwertige Metallgaragen</h1>
              <p className="text-xl mb-8">Maßgeschneiderte Lösungen für Ihr Fahrzeug</p>
              <Link 
                to="/konfigurator" 
                className="bg-blue-600 text-white px-8 py-3 rounded-lg inline-flex items-center hover:bg-blue-700"
              >
                Garage konfigurieren
                <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Unsere Vorteile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">10 Jahre Garantie</h3>
              <p className="text-gray-600">Qualität, der Sie vertrauen können</p>
            </div>
            <div className="text-center p-6">
              <Timer className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Schnelle Lieferung</h3>
              <p className="text-gray-600">Innerhalb von 14 Werktagen</p>
            </div>
            <div className="text-center p-6">
              <Tool className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Professionelle Montage</h3>
              <p className="text-gray-600">Von erfahrenen Experten</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Preview */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Unsere Garagen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Standard Garage",
                image: "https://images.unsplash.com/photo-1558349699-1e1c38c05eef?auto=format&fit=crop&q=80",
                price: "ab 1.299 €"
              },
              {
                title: "Premium Garage",
                image: "https://images.unsplash.com/photo-1623576283720-9f432b41be42?auto=format&fit=crop&q=80",
                price: "ab 1.799 €"
              },
              {
                title: "XXL Garage",
                image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80",
                price: "ab 2.299 €"
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4">{product.price}</p>
                  <Link 
                    to="/konfigurator" 
                    className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center"
                  >
                    Konfigurieren
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;