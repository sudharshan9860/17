import { useState, useEffect } from 'react';

const OrcalexFooterLogo = () => {
  const [date, setDate] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="text-white font-bold text-xl tracking-wider mr-2">
        ORCALEX
      </div>
      <div className="text-white text-sm opacity-90">
        Technologies {date.getFullYear()}
      </div>
    </div>
  );
};

export default OrcalexFooterLogo;