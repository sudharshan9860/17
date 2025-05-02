import { useState, useEffect } from 'react';

const OrcalexLogo = () => {
  const [year, setYear] = useState(2025);
  
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full py-2 relative overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="text-white font-bold text-4xl tracking-wider bg-gradient-to-r from-cyan-400 to-blue-800 bg-clip-text text-transparent">
            ORCALEX
          </div>
        </div>
        <div className="text-white text-sm font-light text-center mt-1">
          Technologies {year}
        </div>
      </div>
    </div>
  );
};

export default OrcalexLogo;