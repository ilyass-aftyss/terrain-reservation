import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
export function useTerrains() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axiosInstance.get('/api/terrains').then(r => setTerrains(r.data)).finally(() => setLoading(false));
  }, []);
  return { terrains, loading };
}