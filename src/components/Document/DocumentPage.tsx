import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, ChevronDown, Check, X } from 'lucide-react';
import { getDocuments } from '../../api';
import { DSM } from '../../types';
import { FilterOption, MultiSelect } from '../ui/multi-select';

const DocumentPage: React.FC = () => {
  const [documents, setDocuments] = useState<DSM[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: [] as FilterOption[],
    technology: [] as FilterOption[],
    generation: [] as FilterOption[],
    function: [] as FilterOption[]
  });
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await getDocuments();
        setDocuments(documents);
      } catch (error) {
        console.error('Error setting documents:', error);
      }
    }

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => 
    (filters.category.length === 0 || filters.category.some(f => f.value === doc.category)) &&
    (filters.technology.length === 0 || filters.technology.some(f => f.value === doc.technology)) &&
    (filters.generation.length === 0 || filters.generation.some(f => f.value === doc.generation)) &&
    (filters.function.length === 0 || filters.function.some(f => f.value === doc.function))
  );

  const unselectedDocuments = filteredDocuments.filter(doc => !selectedDocuments.includes(doc.id));
  const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));

  const handleFilterChange = (filterType: keyof typeof filters, values: FilterOption[]) => {
    setFilters(prev => ({ ...prev, [filterType]: values }));
  };

  const getFilterOptions = (filterType: keyof typeof filters): FilterOption[] => {
    const options = Array.from(new Set(documents.map(doc => doc[filterType])));
    return options.map(option => ({ label: option, value: option }));
  };

  const moveSelected = (direction: 'right' | 'left') => {
    if (direction === 'right') {
      setSelectedDocuments(prev => [...prev, ...unselectedDocuments.map(doc => doc.id)]);
    } else {
      setSelectedDocuments([]);
    }
  };

  const moveOne = (direction: 'right' | 'left', docId: string) => {
    if (direction === 'right') {
      setSelectedDocuments(prev => [...prev, docId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== docId));
    }
  };

  const removeFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(option => option.value !== value)
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {(Object.keys(filters) as Array<keyof typeof filters>).map((filterType) => (
          <MultiSelect
            key={filterType}
            options={getFilterOptions(filterType)}
            selected={filters[filterType]}
            onChange={(values) => handleFilterChange(filterType, values)}
            placeholder={`0 selected`}
            label={filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filters).flatMap(([filterType, options]) =>
          options.map((option) => (
            <span
              key={`${filterType}-${option.value}`}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center"
            >
              {option.label}
              <button
                onClick={() => removeFilter(filterType as keyof typeof filters, option.value)}
                className="ml-1 font-bold"
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-5/12 bg-white rounded shadow mr-2 flex flex-col">
          <h2 className="text-base font-semibold p-2 bg-indigo-200 text-indigo-800">Unselected Documents</h2>
          <ul className="divide-y divide-gray-200 overflow-auto h-[calc(100%-2.5rem)]">
            {unselectedDocuments.map(doc => (
              <li key={doc.id} className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <span className='text-sm'>{doc.name}</span>
                <button
                  onClick={() => moveOne('right', doc.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                  onMouseEnter={() => setHoveredAction(`add-${doc.id}`)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <ChevronRight size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center space-y-4">
          <button
            onClick={() => moveSelected('right')}
            className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            onMouseEnter={() => setHoveredAction('add-all')}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <ChevronsRight size={24} />
          </button>
          <button
            onClick={() => moveSelected('left')}
            className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            onMouseEnter={() => setHoveredAction('remove-all')}
            onMouseLeave={() => setHoveredAction(null)}
          >
            <ChevronsLeft size={24} />
          </button>
        </div>
        <div className="w-5/12 bg-white rounded shadow ml-2">
          <h2 className="text-base font-semibold p-2 bg-indigo-200 text-indigo-800">Selected Documents</h2>
          <ul className="divide-y divide-gray-200 overflow-auto h-[calc(100%-2.5rem)]">
            {selectedDocs.map(doc => (
              <li key={doc.id} className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <span className='text-sm'>{doc.name}</span>
                <button
                  onClick={() => moveOne('left', doc.id)}
                  className="text-indigo-600 hover:text-indigo-800"
                  onMouseEnter={() => setHoveredAction(`remove-${doc.id}`)}
                  onMouseLeave={() => setHoveredAction(null)}
                >
                  <ChevronLeft size={20} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {hoveredAction && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded shadow">
          {hoveredAction.startsWith('add-') && hoveredAction !== 'add-all' && 'Add document'}
          {hoveredAction.startsWith('remove-') && hoveredAction !== 'remove-all' && 'Remove document'}
          {hoveredAction === 'add-all' && 'Add all documents'}
          {hoveredAction === 'remove-all' && 'Remove all documents'}
        </div>
      )}
    </div>
  );
};

export default DocumentPage;