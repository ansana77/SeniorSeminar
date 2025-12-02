import { useState, useMemo } from 'react';
import type { Restroom } from '../Types/restroom.types';
import './RestroomFilter.scss';

export default function RestroomFinder({ allRestrooms }: { allRestrooms: Restroom[] }) {
    const [query, setQuery] = useState<string>('');

    const filteredResults = useMemo(() => {
        return getFilteredRestrooms(query, allRestrooms);
    }, [query, allRestrooms]);

  return (
    <div className="restroom-searchbar">
        <header>
          <h2>Life's complicated enough. Bathroom breaks don't have to be.</h2>
        </header>
        <div className="searchbar-container">
            <label>
                Find a Restroom near you!
            </label>
            <input 
                id="restroom-search" 
                className="restroom-search" 
                placeholder="Search by location, zipcode or feature (e.g. 'accessible 37208')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>

        <div className="results-list">
            {query.length > 0 && filteredResults.length === 0 && (
              <div className="no-results">
                No results found for "{query}".
              </div>
            )}
          
            {filteredResults.map((restroom) => (
              <RestroomCard key={restroom._id} restroom={restroom} />
            ))}
          </div>
    </div>
  )
}

const getFilteredRestrooms = (query: string, allRestrooms: Restroom[]) => {
    const lowerCaseQuery = query.toLowerCase().trim();
    
    if (lowerCaseQuery === "") {
        return [];
    }

    const queryWords = lowerCaseQuery.split(' ').filter(word => word.length > 0);

    return allRestrooms.filter(restroom => {
        const searchableText = [
            restroom.name,
            restroom.address.street,
            restroom.address.city,
            restroom.address.zipCode,
            restroom.comments,
            restroom.isAccessible ? 'accessible' : '',
            restroom.isGenderNeutral ? 'unisex' : '',
            restroom.hasChangingTable ? 'changing table station' : ''
    ].join(' ').toLowerCase();

    return queryWords.some(word => searchableText.includes(word));
    })
}

const RestroomCard = ({ restroom }: { restroom: Restroom }) => {
  return (
    <div className="restroom-card">
      <h3 className="card-header">{restroom.name}</h3>
      <p className="card-street">{restroom.address.street}</p>
      
      <div className="card-tags">
        {restroom.isAccessible && <span className="tag accessible">Accessible</span>}
        {restroom.isGenderNeutral && <span className="tag unisex">Unisex</span>}
        {restroom.hasChangingTable && <span className="tag changing-table">Changing Table</span>}
      </div>
      
      {restroom.comments && <p className="card-info"><strong>Comment:</strong> {restroom.comments}</p>}
    </div>
  );
};