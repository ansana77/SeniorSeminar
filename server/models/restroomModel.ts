import mongoose from 'mongoose';
const { Schema } = mongoose;
const restroomSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            street: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            zipCode: {
                type: String,
            },
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
                index: '2dsphere',
            },
        },
        isAccessible: {
            type: Boolean,
            default: false,
        },
        hasChangingTable: {
            type: Boolean,
            default: false
        },
        isGenderNeutral: {
            type: Boolean,
            default: false,
        },
        comments: {
            type: String,
            maxLength: 400,
        }
    }, {
    timestamps: true,
}
);

const Restroom = mongoose.model('restrooms', restroomSchema)

export default Restroom;