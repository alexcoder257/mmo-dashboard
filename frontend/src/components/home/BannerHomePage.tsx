// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
}

const BannerHomePage: React.FC<IProps> = ({ className }) => {
  return (
    <div
      className={`w-full h-64 bg-gradient-to-r from-primary_700 to-primary_500 rounded-xl flex items-center justify-center ${className ?? ''}`}
    >
      <div className="text-center text-white">
        <h1 className="text-3xl font-bold mb-2">{'Welcome'}</h1>
        <p className="text-lg opacity-80">{'Discover the latest tech products'}</p>
      </div>
    </div>
  );
};

export default BannerHomePage;
