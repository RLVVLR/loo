import React, { useState, useEffect } from 'react';
import { formatDate, formatTime, formatDuration } from '../utils/formatters';

function Statistics() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        console.log('Fetching sessions...');
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:5001/api/sessions', {
          headers: {
            'x-auth-token': token,
          },
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch sessions');
        }

        const data = await response.json();
        console.log('Fetched sessions:', data);
        setSessions(data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m ${secs}s`;
  };

  if (isLoading)
    return (
      <div className='loading-container'>
        <div className='loading'>Loading sessions...</div>
      </div>
    );

  if (error)
    return (
      <div className='error-container'>
        <div className='error'>Error: {error}</div>
      </div>
    );

  return (
    <div className='statistics'>
      <h2>Your Session History</h2>
      {sessions.length === 0 ? (
        <div className='card'>
          <p>No sessions recorded yet. Start your first session!</p>
        </div>
      ) : (
        <div className='sessions-list'>
          {sessions.map((session) => (
            <div key={session._id} className='session-card'>
              <div className='session-header'>
                <h3>{formatDate(session.startTime)}</h3>
              </div>
              <div className='session-details'>
                <div className='detail-item'>
                  <span className='label'>Activity:</span>
                  <span className='value'>{session.activity || 'Not specified'}</span>
                </div>
                <div className='detail-item'>
                  <span className='label'>Start:</span>
                  <span className='value'>
                    {new Date(session.startTime).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='label'>End:</span>
                  <span className='value'>
                    {new Date(session.endTime).toLocaleTimeString('en-GB', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                  </span>
                </div>
                <div className='detail-item'>
                  <span className='label'>Duration:</span>
                  <span className='value'>{formatDuration(session.duration)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Statistics;
