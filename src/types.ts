/**
 * Type definitions for Statistics Canada Grocery Price Tracker
 */

export interface Category {
    name: string;
    count: number;
}

export interface Location {
    location: string;
    city: string;
    province: string;
}

export interface Product {
    product_name: string;
    product_category: string;
    product_unit: string;
}

export interface PriceRecord {
    date: string;
    product_name: string;
    product_category: string;
    price_per_unit: number;
    product_unit: string;
    location: string;
    city: string;
    province: string;
}

export interface Metadata {
    source: string;
    processed_date: string;
    total_records: number;
    date_range: {
        min: string;
        max: string;
    };
    total_products: number;
    total_locations: number;
    total_categories: number;
}

export interface GroceryData {
    metadata: Metadata;
    categories: Category[];
    locations: Location[];
    products: Product[];
    prices: PriceRecord[];
}

export interface ComparisonResult {
    userPrice: number;
    statsCanPrice: number;
    difference: number;
    percentageDifference: number;
    isSaving: boolean;
    product: string;
    location: string;
    year: string;
}