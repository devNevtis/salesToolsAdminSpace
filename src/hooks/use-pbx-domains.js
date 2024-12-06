// src/hooks/use-pbx-domains.js
import { useState, useEffect } from 'react';
import pbxApi from '@/lib/pbx-axios';

export function usePbxDomains() {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDomains = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await pbxApi.get('/fusionpbx/domains/serv1/getAllDomain/');
        const formattedDomains = response.data.map(domain => ({
          value: domain, // Guardamos todo el objeto del dominio
          label: domain.domain_name // Mostramos solo el domain_name
        }));
        setDomains(formattedDomains);
      } catch (err) {
        setError('Failed to fetch PBX domains');
        console.error('Error fetching PBX domains:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  return { domains, isLoading, error };
}