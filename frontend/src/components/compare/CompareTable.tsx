// TODO: implement — stub for build compatibility
import React from 'react';

interface ICompareSection {
  attributes: { label: string; values: string[] }[];
  section?: string;
  title: string;
}

interface IProps {
  className?: string;
  id?: string;
  section?: ICompareSection;
  sections?: ICompareSection[];
}

export const CompareTable: React.FC<IProps> = ({ className, id, section, sections }) => {
  const items = section ? [section] : (sections ?? []);

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`} id={id}>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {'No comparison data available'}
        </div>
      ) : (
        items.map((s, sectionIdx) => (
          <div className="mb-6" key={s.section ?? sectionIdx}>
            <h3 className="font-semibold text-lg mb-3 px-2">{s.title}</h3>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {s.attributes.map((attr, attrIdx) => (
                  <tr
                    className={attrIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    key={attrIdx}
                  >
                    <td className="py-2 px-4 font-medium text-gray-700 w-40">
                      {attr.label}
                    </td>
                    {attr.values.map((val, valIdx) => (
                      <td className="py-2 px-4 text-gray-600" key={valIdx}>
                        {val || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};
