import React from 'react';

interface GarageVisualizationProps {
  width: number;
  length: number;
  height: number;
  color: string;
  roofType: string;
}

const GarageVisualization: React.FC<GarageVisualizationProps> = ({
  width,
  length,
  height,
  color,
  roofType
}) => {
  const scale = 0.25; // Increased scale for larger visualization
  const colors = {
    'RAL7016': '#293133',
    'RAL9006': '#A5A5A5',
    'RAL9016': '#F1F1F1',
    'RAL3000': '#AF2B1E',
    'RAL5010': '#0E294B',
    'RAL6005': '#0F4336',
    'RAL8017': '#44322D',
    'RAL9005': '#0A0A0A'
  };

  const getRoofStyle = () => {
    const baseStyle = {
      position: 'absolute',
      backgroundColor: colors[color as keyof typeof colors],
      transition: 'all 0.3s ease',
      border: '2px solid rgba(0,0,0,0.1)', // Added border for better contours
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Added shadow for depth
    };

    switch (roofType) {
      case 'elevated':
        return {
          ...baseStyle,
          width: `${width * scale}px`,
          height: `${length * scale}px`,
          transform: `rotateX(60deg) translateZ(${height * scale * 1.1}px)`,
          clipPath: 'polygon(0 0, 50% 50%, 100% 0)',
          borderTop: '3px solid rgba(0,0,0,0.2)', // Enhanced roof edge
        };
      case 'flat':
        return {
          ...baseStyle,
          width: `${width * scale}px`,
          height: `${length * scale}px`,
          transform: `rotateX(60deg) translateZ(${height * scale}px)`,
        };
      case 'asymmetric':
        return {
          ...baseStyle,
          width: `${width * scale}px`,
          height: `${length * scale}px`,
          transform: `rotateX(60deg) translateZ(${height * scale}px)`,
          clipPath: 'polygon(0 0, 100% 30%, 100% 100%, 0% 100%)',
          borderTop: '3px solid rgba(0,0,0,0.2)', // Enhanced roof edge
        };
      case 'pent':
        return {
          ...baseStyle,
          width: `${width * scale}px`,
          height: `${length * scale}px`,
          transform: `rotateX(60deg) translateZ(${height * scale}px)`,
          clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)',
          borderTop: '3px solid rgba(0,0,0,0.2)', // Enhanced roof edge
        };
      default: // standard
        return {
          ...baseStyle,
          width: `${width * scale}px`,
          height: `${length * scale}px`,
          transform: `rotateX(60deg) translateZ(${height * scale}px)`,
          clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0 100%)',
          borderTop: '3px solid rgba(0,0,0,0.2)', // Enhanced roof edge
        };
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden"> {/* Increased height */}
      <div
        className="absolute left-1/2 top-1/2 transform-gpu -translate-x-1/2 -translate-y-1/2"
        style={{
          perspective: '1500px', // Increased perspective for better 3D effect
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front wall */}
        <div
          style={{
            width: `${width * scale}px`,
            height: `${height * scale}px`,
            backgroundColor: colors[color as keyof typeof colors],
            transform: 'rotateX(0deg)',
            position: 'absolute',
            transformOrigin: 'bottom',
            transition: 'all 0.3s ease',
            border: '2px solid rgba(0,0,0,0.1)', // Added border for better contours
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Added shadow for depth
          }}
        />

        {/* Side wall */}
        <div
          style={{
            width: `${length * scale}px`,
            height: `${height * scale}px`,
            backgroundColor: colors[color as keyof typeof colors],
            transform: 'rotateY(90deg)',
            position: 'absolute',
            transformOrigin: 'left',
            transition: 'all 0.3s ease',
            border: '2px solid rgba(0,0,0,0.1)', // Added border for better contours
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', // Added shadow for depth
          }}
        />

        {/* Roof */}
        <div style={getRoofStyle() as any} />
      </div>

      {/* Add rotation controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={() => {
            const container = document.querySelector('[style*="perspective"]') as HTMLElement;
            if (container) {
              container.style.transform = `${container.style.transform || ''} rotateY(-30deg)`;
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Links drehen
        </button>
        <button
          onClick={() => {
            const container = document.querySelector('[style*="perspective"]') as HTMLElement;
            if (container) {
              container.style.transform = `${container.style.transform || ''} rotateY(30deg)`;
            }
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rechts drehen
        </button>
      </div>
    </div>
  );
};

export default GarageVisualization;