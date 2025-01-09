import React, { useState, useEffect } from 'react';
import { formatTime, formatDuration } from '../utils/formatters';
import DigitalCounter from './DigitalCounter';

function ToiletTracker() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [endAttempted, setEndAttempted] = useState(false);

  const activities = [
    'Peeing',
    'Pooping',
    'Just Washing Hands',
    'Flushing the Toilet',
    'Women Hygiene Routine',
    'Sexual Activity',
    'Reading',
    'Mobile stuff',
    'Serenity and Relaxation Time',
  ];

  useEffect(() => {
    let timer;
    if (sessionStarted) {
      timer = setInterval(() => {
        setDuration(Math.floor((new Date() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionStarted, startTime]);

  const startSession = () => {
    setStartTime(new Date());
    setSessionStarted(true);
    setSelectedActivity('');
    setEndAttempted(false);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    if (endAttempted) {
      endSession(activity);
    }
  };

  const endSession = async (finalActivity = selectedActivity) => {
    if (!finalActivity) {
      setEndAttempted(true);
      return;
    }

    const endTime = new Date();
    const finalDuration = Math.floor((endTime - startTime) / 1000);

    try {
      const response = await fetch('http://localhost:5001/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          activity: finalActivity,
          startTime: startTime,
          endTime: endTime,
          duration: finalDuration,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save session');
      }

      setSessionSummary({
        activity: finalActivity,
        startTime: startTime,
        endTime: endTime,
        duration: finalDuration,
      });

      setSessionStarted(false);
      setShowSummary(true);
      setShowConfirmEnd(false);
      setEndAttempted(false);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session');
    }
  };

  const handleEndClick = () => {
    if (duration < 5) {
      // Changed from 30 to 5 seconds
      setShowConfirmEnd(true);
    } else if (!selectedActivity) {
      setEndAttempted(true);
    } else {
      endSession();
    }
  };

  return (
    <div className='toilet-tracker'>
      {!sessionStarted && !showSummary && (
        <button className='main-loo-button' onClick={startSession}>
          To The Loo
        </button>
      )}

      {sessionStarted && (
        <div className='active-session'>
          <div className='session-content'>
            <div className='session-header'>
              <div className='counters-container'>
                <DigitalCounter label='Start Time' value={formatTime(startTime)} />
                <DigitalCounter label='Duration' value={formatDuration(duration)} />
              </div>

              {!showConfirmEnd && (
                <button className='end-session-button' onClick={handleEndClick}>
                  OUT OF THE LOO
                </button>
              )}
            </div>

            <div className='activity-selection'>
              <h3>Select Activity</h3>
              <div className='activity-grid'>
                {activities.map((activity) => (
                  <button
                    key={activity}
                    className={`button button-activity ${selectedActivity === activity ? 'selected' : ''}`}
                    onClick={() => handleActivitySelect(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>

              {endAttempted && !selectedActivity && <div className='warning-message'>Please select an activity before ending the session</div>}
            </div>
          </div>
        </div>
      )}

      {showSummary && sessionSummary && (
        <div className='session-summary card'>
          <h2>Session Complete</h2>
          <div className='summary-details'>
            <div className='detail-item'>
              <span className='label'>Activity:</span>
              <span className='value'>{sessionSummary.activity}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Start Time:</span>
              <span className='value'>{formatTime(sessionSummary.startTime)}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>End Time:</span>
              <span className='value'>{formatTime(sessionSummary.endTime)}</span>
            </div>
            <div className='detail-item'>
              <span className='label'>Duration:</span>
              <span className='value'>{formatDuration(sessionSummary.duration)}</span>
            </div>
          </div>
          <button className='button button-primary' onClick={() => setShowSummary(false)}>
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}

export default ToiletTracker;
