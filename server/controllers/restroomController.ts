import type { Request, Response } from 'express';
import Restroom from '../models/restroomModel.js';

export const getAllRestrooms = async (req: Request, res: Response) => {
    try {
        const restrooms = await Restroom.find({});
        res.status(200).json(restrooms);
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

        const newRestroom = new Restroom(restroomData);
        await newRestroom.save();

        res.status(201).json(newRestroom);
    } catch (error) {
        res.status(400).json({ message: 'Error creating restroom', error });
    }
};