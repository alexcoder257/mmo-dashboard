// TODO: implement — stub for build compatibility
import React from 'react';

import { IProductDocument } from '@/models/interfaces/product.interface';

interface IProps {
  className?: string;
  documents?: IProductDocument[];
}

const ProductDocuments: React.FC<IProps> = ({ documents = [] }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      {documents.length === 0 ? (
        <p className="text-gray-400 text-center py-8">{'No documents available'}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {documents.map((doc) => (
            <a
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              href={doc.url}
              key={doc.fileId}
              rel="noopener noreferrer"
              target="_blank"
            >
              {doc.iconUrl && (
                <img alt={doc.iconAlt} className="w-8 h-8" src={doc.iconUrl} />
              )}
              <div>
                <div className="font-medium text-sm">{doc.label || doc.fileName}</div>
                <div className="text-xs text-gray-400">{doc.mimeType}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDocuments;
