import { useState, useEffect } from 'react';
import { getAllSuggestions } from '../api/api';

const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllSuggestions()
      .then((res) => setSuggestions(res.data.suggestions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { suggestions, loading, error };
};

export default useSuggestions;
