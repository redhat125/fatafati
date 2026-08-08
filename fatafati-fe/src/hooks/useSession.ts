'use client';

import { useState, useEffect } from 'react';

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Anonymous Creator');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let storedId = localStorage.getItem('fatafati_session_id');
    if (!storedId) {
      storedId = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem('fatafati_session_id', storedId);
    }
    setSessionId(storedId);

    const storedName = localStorage.getItem('fatafati_author_name');
    if (storedName) {
      setAuthorName(storedName);
    }

    setIsLoaded(true);
  }, []);

  const updateAuthorName = (name: string) => {
    setAuthorName(name);
    localStorage.setItem('fatafati_author_name', name);
  };

  return {
    sessionId,
    authorName,
    setAuthorName: updateAuthorName,
    isLoaded,
  };
}
