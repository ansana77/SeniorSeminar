import '../../App.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import './LandingPage.scss';
import type { Restroom } from '../../Types/restroom.types';
import RestroomFinder from '../../RestroomFilter/RestroomFilter';

function LandingPage() {
  const [restrooms, setRestrooms] = useState<Restroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchRestrooms = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/restrooms');
        setRestrooms(response.data)
      } catch (err) {
        setError('Failed to fetch restrooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestrooms();
  }, [])
  
  if (loading) {
    return <div>Loading restrooms</div>
  }

  if (error) {
    return <div>Error: {error} </div>
  }

  return (
    <div className="landing-page-container">
      <div className="hero-image-container">
        <img 
          src="/PottySpotty.svg" 
          alt="PottySpotty" 
          className="hero-image"
        />
      </div>
      <RestroomFinder allRestrooms={restrooms} />
    </div>
  )
}

export default LandingPage;
