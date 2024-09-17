import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface FilterOption {
    label: string;
    value: string;
  }

  export const MultiSelect: React.FC<{
    options: FilterOption[];
    selected: FilterOption[];
    onChange: (selected: FilterOption[]) => void;
    placeholder: string;
    label: string;
  }> = ({ options, selected, onChange, placeholder, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    const toggleOption = (option: FilterOption) => {
      const updatedSelected = selected.some(item => item.value === option.value)
        ? selected.filter(item => item.value !== option.value)
        : [...selected, option];
      onChange(updatedSelected);
    };
  
    return (
      <div className="relative flex-grow" ref={ref}>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div
          className="bg-white border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate">
            {selected.length === 0 ? placeholder : `${selected.length} selected`}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map(option => (
              <div
                key={option.value}
                className={`p-2 hover:bg-indigo-100 cursor-pointer flex justify-between items-center ${
                  selected.some(item => item.value === option.value) ? 'bg-indigo-50' : ''
                }`}
                onClick={() => toggleOption(option)}
              >
                <span>{option.label}</span>
                {selected.some(item => item.value === option.value) && <Check className="h-5 w-5 text-indigo-600" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  