import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
export function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const refetch = () => {
    setLoading(true);
    axiosInstance.get('/api/reservations').then(r => setReservations(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { refetch(); }, []);
  return { reservations, loading, refetch };
}