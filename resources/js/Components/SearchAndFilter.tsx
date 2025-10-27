import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Button from '@/Components/Button';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterOption {
    key: string;
    label: string;
    options: string[];
}

interface SearchAndFilterProps {
    searchPlaceholder?: string;
    filters: FilterOption[];
    currentFilters: Record<string, string>;
    routeName: string;
    debounceMs?: number;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
    searchPlaceholder = 'ابحث...',
    filters,
    currentFilters,
    routeName,
    debounceMs = 300,
}) => {
    const [search, setSearch] = useState(currentFilters.search || '');
    const [localFilters, setLocalFilters] = useState(currentFilters);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId: number;
            return (query: string) => {
                clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    updateFilters({ ...localFilters, search: query });
                }, debounceMs);
            };
        })(),
        [localFilters, debounceMs]
    );

    const updateFilters = (newFilters: Record<string, string>) => {
        setLocalFilters(newFilters);
        router.get(route(routeName), newFilters, { preserveState: true });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...localFilters, [key]: value };
        updateFilters(newFilters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setLocalFilters({});
        router.get(route(routeName), {}, { preserveState: true });
    };

    useEffect(() => {
        setSearch(currentFilters.search || '');
        setLocalFilters(currentFilters);
    }, [currentFilters]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700" dir="rtl">
            <div className="flex items-center mb-4">
                <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 ml-2" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">البحث والفلترة</h3>
            </div>

            {/* Search Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البحث</label>
                <div className="relative">
                    <TextInput
                        type="text"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder={searchPlaceholder}
                        className="pl-10 w-full"
                    />
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Filter Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {filters.map((filter) => (
                    <div key={filter.key}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {filter.label}
                        </label>
                        <select
                            value={localFilters[filter.key] || ''}
                            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-primary-500 dark:focus:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 rounded-md shadow-sm"
                        >
                            <option value="">الكل</option>
                            {filter.options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
                <Button onClick={handleClearFilters} className="bg-gray-500 hover:bg-gray-600">
                    <XMarkIcon className="w-5 h-5 ml-2" />
                    مسح الفلاتر
                </Button>
            </div>
        </div>
    );
};

export default SearchAndFilter;