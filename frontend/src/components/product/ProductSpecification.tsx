// TODO: implement — stub for build compatibility
import React from 'react';

interface IProps {
  className?: string;
  specifications?: ISpecRow[];
}

interface ISpecRow {
  code: string;
  label: string;
  value: string;
}

const ProductSpecification: React.FC<IProps> = ({ specifications = [] }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      {specifications.length === 0 ? (
        <p className="text-gray-400 text-center py-8">{'No specifications available'}</p>
      ) : (
        <table className="w-full text-sm">
          <tbody>
            {specifications.map((spec, idx) => (
              <tr
                className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                key={spec.code}
              >
                <td className="py-2 px-4 font-medium text-gray-700 w-1/3">
                  {spec.label}
                </td>
                <td className="py-2 px-4 text-gray-600">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductSpecification;
