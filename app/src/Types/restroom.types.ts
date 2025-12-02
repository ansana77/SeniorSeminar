export interface Restroom {
    _id: string;
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode?: string;
    };
    location: {
        type: 'Point';
        coordinates: [number, number] // [longitude, latitude]
    }
    isAccessible: Boolean;
    hasChangingTable: Boolean;
    isGenderNeutral: Boolean;
    comments?: string;
    createdAt: string;
    updatedAt: string;
}

// Form data type for submitting new restrooms
export interface RestroomFormData {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isAccessible: boolean;
    isGenderNeutral: boolean;
    hasChangingTable: boolean;
    directions: string;
    comments: string;
}