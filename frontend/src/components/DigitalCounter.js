import React from 'react';

function DigitalCounter({ label, value }) {
  return (
    <div className='timer-item'>
      <span className='timer-label'>{label}</span>
      <div className='digital-counter'>{value}</div>
    </div>
  );
}

export default DigitalCounter;
