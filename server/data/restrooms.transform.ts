 import rawData from './rawRestroom.json' with { type: 'json' };

export const restrooms = rawData.map(rawRestroom => {
  const combinedComments = [
    rawRestroom.directions?.trim(), 
    rawRestroom.comment?.trim()
  ].filter(Boolean).join(' | '); 
  return {
    name: rawRestroom.name.trim(),
    address: {
      street: rawRestroom.street.trim(),
      city: rawRestroom.city.trim(),
      state: 'TN', 
      zipCode: '', 
    },

    location: {
      type: 'Point',
      coordinates: [rawRestroom.longitude, rawRestroom.latitude],
    },

    isAccessible: rawRestroom.accessible,
    hasChangingTable: rawRestroom.changing_table,
    isGenderNeutral: rawRestroom.unisex,
    comments: combinedComments,
  };
});