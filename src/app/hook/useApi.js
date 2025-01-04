'use client'
// src/hook/useApi.js
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';

const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(url, options);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if url is provided and has not been fetched yet
    if (url) {
      fetchData();
    }

  }, [url]); // Only trigger the effect when the URL changes

  return { data, loading, error };
};

export default useApi;
