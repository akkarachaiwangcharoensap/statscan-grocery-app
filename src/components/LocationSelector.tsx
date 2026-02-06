import { useState, useRef, useEffect } from 'react';
import { useGroceryData } from '../hooks';
import { useLocationPreference } from '../hooks/useLocationPreference';
import { abbreviateProvince } from '../utils/stringUtils';

export default function LocationSelector(): React.ReactElement | null {
    const { data, loading } = useGroceryData();
    const { location, setLocation } = useLocationPreference();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Show loading state
    if (loading || !data) {
        return (
            <div className="relative">
                <button
                    disabled
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-400 text-white text-sm font-semibold cursor-not-allowed opacity-75"
                    aria-label="Loading locations">
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Loading...</span>
                </button>
            </div>
        );
    }

    const locations = ['Canada', ...data.locations.map((l) => l.location).filter((loc) => loc !== 'Canada')];

    const handleSelect = (loc: string) => {
        setLocation(loc);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                aria-haspopup="true"
                aria-expanded={isOpen}
                title={location}>
                {/* Always show abbreviation */}
                <span>{abbreviateProvince(location)}</span>

                {/* Chevron icon */}
                <i className={`fas fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white border border-gray-200 rounded-xl overflow-hidden z-50">
                    <div className="max-h-80 overflow-y-auto">
                        {locations.map((loc) => (
                            <button
                                key={loc}
                                onClick={() => handleSelect(loc)}
                                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${loc === location ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-900'
                                    }`}>
                                {loc}
                                {loc === location && (
                                    <span className="float-right text-blue-600">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}