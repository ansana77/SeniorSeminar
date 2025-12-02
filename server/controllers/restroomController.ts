import type { Request, Response } from 'express';
import Restroom from '../models/restroomModel.js';
import { geocodeAddress } from '../utils/geocoding.js';

export const getAllRestrooms = async (req: Request, res: Response) => {
    try {
        const restrooms = await Restroom.find({});
        res.status(200).json(restrooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getRestroomsInBounds = async (req: Request, res: Response) => {
    try {
        const { minLat, maxLat, minLng, maxLng } = req.query;

        if (!minLat || !maxLat || !minLng || !maxLng) {
            return res.status(400).json({ message: 'Bounds parameters are required' });
        }

        // Query restrooms within the bounding box
        const restrooms = await Restroom.find({
            'location.coordinates.1': { $gte: parseFloat(minLat as string), $lte: parseFloat(maxLat as string) },
            'location.coordinates.0': { $gte: parseFloat(minLng as string), $lte: parseFloat(maxLng as string) }
        });

        res.status(200).json(restrooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const getNearbyRestrooms = async (req: Request, res: Response) => {
    try {
        const { lat, lng, maxDistance = 10 } = req.query; // maxDistance in km

        if (!lat || !lng) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        // Use MongoDB's geospatial query to find nearby restrooms
        const restrooms = await Restroom.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
                    },
                    $maxDistance: parseFloat(maxDistance as string) * 1000 // Convert km to meters
                }
            }
        }).limit(50); // Limit to 50 nearest

        res.status(200).json(restrooms);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const checkRestroomExists = async (req: Request, res: Response) => {
    try {
        const { name, street, city } = req.query;
        
        if (!name || !street || !city) {
            return res.status(400).json({ message: 'Name, street, and city are required' });
        }

        const exists = await Restroom.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            'address.street': { $regex: new RegExp(`^${street}$`, 'i') },
            'address.city': { $regex: new RegExp(`^${city}$`, 'i') }
        });

        res.status(200).json({ exists: !!exists });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

export const createRestroom = async (req: Request, res: Response) => {
    try {
        // We get the data from the request body
        const restroomData = req.body;
        
        // A basic validation to ensure we have a name
        if (!restroomData.name || !restroomData.address) {
            return res.status(400).json({ message: 'Missing required fields: name and address are required.' });
        }

        // Check for duplicates before creating
        const existingRestroom = await Restroom.findOne({
            name: { $regex: new RegExp(`^${restroomData.name}$`, 'i') },
            'address.street': { $regex: new RegExp(`^${restroomData.address.street}$`, 'i') },
            'address.city': { $regex: new RegExp(`^${restroomData.address.city}$`, 'i') }
        });

        if (existingRestroom) {
            return res.status(409).json({ message: 'A restroom with this name and address already exists.' });
        }

        // Geocode the address to get coordinates
        const coordinates = await geocodeAddress(
            restroomData.address.street,
            restroomData.address.city,
            restroomData.address.state,
            restroomData.address.zipCode
        );

        // If geocoding fails, return error to user
        if (!coordinates) {
            return res.status(400).json({ 
                message: 'Unable to find the location for this address. Please verify the address is correct and try again.' 
            });
        }

        // Add location data to restroom
        restroomData.location = {
            type: 'Point',
            coordinates: coordinates
        };

        const newRestroom = new Restroom(restroomData);
        await newRestroom.save();

        res.status(201).json(newRestroom);
    } catch (error) {
        res.status(400).json({ message: 'Error creating restroom', error });
    }
};