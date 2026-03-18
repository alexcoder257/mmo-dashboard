// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
}

const CategoriesHomePage: React.FC<IProps> = ({ className }) => {
  return (
    <div className={`w-full py-8 ${className ?? ''}`}>
      <h2 className="text-xl font-bold mb-4">{'Categories'}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            key={i}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full" />
            <span className="text-xs text-gray-600 text-center">{'Category'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesHomePage;
