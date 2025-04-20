import React, { useState, useEffect } from 'react';
import { Check, Info } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import GarageVisualization from '../components/GarageVisualization';

interface GarageConfig {
  width: number;
  length: number;
  height: number;
  color: string;
  roofType: string;
  gateType: string;
  gatePosition: string;
  extras: string[];
  wallThickness: string;
  foundation: string;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  user_id?: string;
}

const Configurator = () => {
  const [config, setConfig] = useState<GarageConfig>({
    width: 300,
    length: 500,
    height: 220,
    color: 'RAL7016',
    roofType: 'standard',
    gateType: 'rollup',
    gatePosition: 'front',
    extras: [],
    wallThickness: 'standard',
    foundation: 'concrete'
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: ''
  });

  const [activeTab, setActiveTab] = useState('dimensions');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  useEffect(() => {
    const trackVisit = async () => {
      await supabase
        .from('visitors')
        .insert([{ page: '/konfigurator', user_agent: navigator.userAgent }]);
    };
    trackVisit();
  }, []);

  const colors = [
    { id: 'RAL7016', name: 'Anthrazitgrau', hex: '#293133' },
    { id: 'RAL9006', name: 'Weißaluminium', hex: '#A5A5A5' },
    { id: 'RAL9016', name: 'Verkehrsweiß', hex: '#F1F1F1' },
    { id: 'RAL3000', name: 'Feuerrot', hex: '#AF2B1E' },
    { id: 'RAL5010', name: 'Enzianblau', hex: '#0E294B' },
    { id: 'RAL6005', name: 'Moosgrün', hex: '#0F4336' },
    { id: 'RAL8017', name: 'Schokoladenbraun', hex: '#44322D' },
    { id: 'RAL9005', name: 'Tiefschwarz', hex: '#0A0A0A' }
  ];

  const roofTypes = [
    { id: 'standard', name: 'Standarddach', price: 0, description: 'Klassisches Flachdach mit leichter Neigung' },
    { id: 'elevated', name: 'Satteldach', price: 450, description: 'Traditionelles Spitzdach mit 15° Neigung' },
    { id: 'flat', name: 'Flachdach', price: 300, description: 'Modernes Flachdach ohne Neigung' },
    { id: 'asymmetric', name: 'Asymmetrisches Dach', price: 550, description: 'Modernes Design mit unterschiedlichen Neigungen' },
    { id: 'pent', name: 'Pultdach', price: 400, description: 'Einseitig geneigtes Dach' }
  ];

  const gateTypes = [
    { id: 'rollup', name: 'Rolltor', price: 0, description: 'Platzsparendes Aufrolltor' },
    { id: 'sectional', name: 'Sektionaltor', price: 450, description: 'Isoliertes Tor aus Paneelen' },
    { id: 'swing', name: 'Schwingtor', price: 300, description: 'Klassisches Schwingtor' },
    { id: 'double', name: 'Zweiflügeltor', price: 250, description: 'Traditionelles zweiflügeliges Tor' }
  ];

  const gatePositions = [
    { id: 'front', name: 'Vorderseite', price: 0 },
    { id: 'back', name: 'Rückseite', price: 0 },
    { id: 'left', name: 'Linke Seite', price: 150 },
    { id: 'right', name: 'Rechte Seite', price: 150 }
  ];

  const wallThicknesses = [
    { id: 'standard', name: 'Standard (0.5mm)', price: 0 },
    { id: 'reinforced', name: 'Verstärkt (0.75mm)', price: 300 },
    { id: 'premium', name: 'Premium (1.0mm)', price: 600 }
  ];

  const foundations = [
    { id: 'concrete', name: 'Betonfundament', price: 800, description: 'Stabiles Betonfundament' },
    { id: 'point', name: 'Punktfundament', price: 400, description: 'Kostengünstige Lösung' },
    { id: 'screw', name: 'Schraubfundament', price: 600, description: 'Schnelle Installation' },
    { id: 'none', name: 'Ohne Fundament', price: 0, description: 'Eigeninstallation' }
  ];

  const extras = [
    { id: 'door', name: 'Zusätzliche Tür', price: 299, description: 'Separate Eingangstür' },
    { id: 'window', name: 'Fenster', price: 199, description: 'Doppelverglastes Fenster' },
    { id: 'gutters', name: 'Dachrinnen', price: 159, description: 'Komplettes Entwässerungssystem' },
    { id: 'ventilation', name: 'Lüftungssystem', price: 249, description: 'Aktive Belüftung' },
    { id: 'insulation', name: 'Isolierung', price: 899, description: 'Thermische Isolierung' },
    { id: 'electricity', name: 'Elektroinstallation', price: 599, description: 'Grundlegende Elektrik' },
    { id: 'reinforcement', name: 'Schneelastversträrkung', price: 449, description: 'Erhöhte Tragfähigkeit' },
    { id: 'security', name: 'Sicherheitspaket', price: 349, description: 'Zusätzliche Verriegelung' }
  ];

  const handleExtraToggle = (extraId: string) => {
    setConfig(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  const calculatePrice = () => {
    let basePrice = (config.width * config.length) / 10000 * 120;
    const roofPrice = roofTypes.find(r => r.id === config.roofType)?.price || 0;
    const gatePrice = gateTypes.find(g => g.id === config.gateType)?.price || 0;
    const gatePositionPrice = gatePositions.find(p => p.id === config.gatePosition)?.price || 0;
    const wallPrice = wallThicknesses.find(w => w.id === config.wallThickness)?.price || 0;
    const foundationPrice = foundations.find(f => f.id === config.foundation)?.price || 0;
    const extrasPrice = extras
      .filter(e => config.extras.includes(e.id))
      .reduce((sum, extra) => sum + extra.price, 0);
    
    return basePrice + roofPrice + gatePrice + gatePositionPrice + wallPrice + foundationPrice + extrasPrice;
  };

  const handleSubmitOrder = async () => {
    if (!customerInfo.name || !customerInfo.email) {
      setOrderError('Bitte füllen Sie alle erforderlichen Felder aus.');
      return;
    }

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }

      // Create anonymous session if user is not logged in
      if (!session) {
        const { data: { session: anonSession }, error: signInError } = await supabase.auth.signInWithPassword({
          email: customerInfo.email,
          password: customerInfo.name // Using name as a simple password for demo
        });

        if (signInError) {
          // If sign in fails, create a new user
          const { data: { session: newSession }, error: signUpError } = await supabase.auth.signUp({
            email: customerInfo.email,
            password: customerInfo.name,
          });

          if (signUpError) {
            throw signUpError;
          }
        }
      }

      // Get the current user after ensuring authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Failed to get user information');
      }

      const order = {
        config,
        customer: {
          ...customerInfo,
          user_id: user.id
        },
        total_price: calculatePrice(),
        status: 'pending'
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert([order]);

      if (insertError) {
        throw insertError;
      }

      setOrderSuccess(true);
      setCustomerInfo({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error submitting order:', error);
      setOrderError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  const tabs = [
    { id: 'dimensions', name: 'Abmessungen' },
    { id: 'design', name: 'Design' },
    { id: 'gate', name: 'Tor' },
    { id: 'construction', name: 'Konstruktion' },
    { id: 'extras', name: 'Extras' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Garagen-Konfigurator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* 3D Visualization */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Vorschau</h2>
            <GarageVisualization
              width={config.width}
              length={config.length}
              height={config.height}
              color={config.color}
              roofType={config.roofType}
            />
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto space-x-4 bg-white p-4 rounded-lg shadow">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Dimensions Tab */}
          {activeTab === 'dimensions' && (
            <div className="bg-white p-8 rounded-lg shadow space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Abmessungen</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Breite (cm)
                    </label>
                    <span className="text-sm text-gray-600">{config.width} cm</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="800"
                    step="10"
                    value={config.width}
                    onChange={(e) => setConfig({...config, width: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">250 cm</span>
                    <span className="text-xs text-gray-500">800 cm</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Länge (cm)
                    </label>
                    <span className="text-sm text-gray-600">{config.length} cm</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1200"
                    step="10"
                    value={config.length}
                    onChange={(e) => setConfig({...config, length: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">400 cm</span>
                    <span className="text-xs text-gray-500">1200 cm</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Höhe (cm)
                    </label>
                    <span className="text-sm text-gray-600">{config.height} cm</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="350"
                    step="10"
                    value={config.height}
                    onChange={(e) => setConfig({...config, height: Number(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">200 cm</span>
                    <span className="text-xs text-gray-500">350 cm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design Tab */}
          {activeTab === 'design' && (
            <div className="space-y-8">
              {/* Colors */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Farbe</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setConfig({...config, color: color.id})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.color === color.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-full h-12 rounded mb-2"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Roof Types */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Dachtyp</h2>
                <div className="space-y-4">
                  {roofTypes.map(roof => (
                    <button
                      key={roof.id}
                      onClick={() => setConfig({...config, roofType: roof.id})}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        config.roofType === roof.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{roof.name}</span>
                          <p className="text-sm text-gray-600 mt-1">{roof.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-900 font-medium">
                            {roof.price > 0 ? `+${roof.price} €` : 'Inklusive'}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Gate Tab */}
          {activeTab === 'gate' && (
            <div className="space-y-8">
              {/* Gate Types */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Tortyp</h2>
                <div className="space-y-4">
                  {gateTypes.map(gate => (
                    <button
                      key={gate.id}
                      onClick={() => setConfig({...config, gateType: gate.id})}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        config.gateType === gate.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{gate.name}</span>
                          <p className="text-sm text-gray-600 mt-1">{gate.description}</p>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {gate.price > 0 ? `+${gate.price} €` : 'Inklusive'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gate Position */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Torposition</h2>
                <div className="grid grid-cols-2 gap-4">
                  {gatePositions.map(position => (
                    <button
                      key={position.id}
                      onClick={() => setConfig({...config, gatePosition: position.id})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.gatePosition === position.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{position.name}</span>
                      {position.price > 0 && (
                        <p className="text-sm text-gray-600 mt-1">+{position.price} €</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Construction Tab */}
          {activeTab === 'construction' && (
            <div className="space-y-8">
              {/* Wall Thickness */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Wandstärke</h2>
                <div className="space-y-4">
                  {wallThicknesses.map(thickness => (
                    <button
                      key={thickness.id}
                      onClick={() => setConfig({...config, wallThickness: thickness.id})}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        config.wallThickness === thickness.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{thickness.name}</span>
                        <span className="text-gray-900">
                          {thickness.price > 0 ? `+${thickness.price} €` : 'Inklusive'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Foundation */}
              <div className="bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-semibold mb-6">Fundament</h2>
                <div className="space-y-4">
                  {foundations.map(foundation => (
                    <button
                      key={foundation.id}
                      onClick={() => setConfig({...config, foundation: foundation.id})}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        config.foundation === foundation.id 
                          ? 'border-blue-600 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{foundation.name}</span>
                          <p className="text-sm text-gray-600 mt-1">{foundation.description}</p>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {foundation.price > 0 ? `+${foundation.price} €` : 'Inklusive'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Extras Tab */}
          {activeTab === 'extras' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-6">Extras</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {extras.map(extra => (
                  <button
                    key={extra.id}
                    onClick={() => handleExtraToggle(extra.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      config.extras.includes(extra.id) 
                        ? 'border-blue-600 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{extra.name}</span>
                          {config.extras.includes(extra.id) && (
                            <Check className="h-5 w-5 text-blue-600 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{extra.description}</p>
                      </div>
                      <span className="text-gray-900 font-medium">+{extra.price} €</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary and Order */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow sticky top-8">
            <h2 className="text-2xl font-semibold mb-6">Ihre Konfiguration</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Abmessungen</span>
                <span className="font-medium">{config.width}x{config.length}x{config.height} cm</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Farbe</span>
                <span className="font-medium">{colors.find(c => c.id === config.color)?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Dachtyp</span>
                <span className="font-medium">{roofTypes.find(r => r.id === config.roofType)?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Tor</span>
                <span className="font-medium">
                  {gateTypes.find(g => g.id === config.gateType)?.name} ({gatePositions.find(p => p.id === config.gatePosition)?.name})
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Wandstärke</span>
                <span className="font-medium">{wallThicknesses.find(w => w.id === config.wallThickness)?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Fundament</span>
                <span className="font-medium">{foundations.find(f => f.id === config.foundation)?.name}</span>
              </div>
              {config.extras.length > 0 && (
                <div className="py-2 border-b">
                  <span className="text-gray-600">Extras</span>
                  <div className="mt-1">
                    {config.extras.map(id => (
                      <div key={id} className="flex justify-between text-sm">
                        <span>{extras.find(e => e.id === id)?.name}</span>
                        <span>+{extras.find(e => e.id === id)?.price} €</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-4">
                <div className="flex justify-between text-xl font-semibold">
                  <span>Gesamtpreis</span>
                  <span>{calculatePrice().toLocaleString()} €</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Inkl. MwSt. und Lieferung
                </p>
              </div>
            </div>

            {!orderSuccess ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Ihre Kontaktdaten</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {orderError && (
                  <div className="text-red-600 text-sm">{orderError}</div>
                )}

                <button
                  onClick={handleSubmitOrder}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Jetzt bestellen
                </button>
              </div>
            ) : (
              <div className="mt-8 text-center">
                <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                  <Check className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Vielen Dank für Ihre Bestellung!</p>
                
                  <p className="text-sm mt-2">Wir werden uns in Kürze bei Ihnen melden.</p>
                </div>
                <button
                  onClick={() => setOrderSuccess(false)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Neue Konfiguration erstellen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;