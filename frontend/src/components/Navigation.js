import React from 'react';

function Navigation({ activeTab, setActiveTab, handleLogout }) {
  return (
    <nav className='navigation'>
      <div className='nav-tabs'>
        <button className={`nav-tab ${activeTab === 'tracker' ? 'active' : ''}`} onClick={() => setActiveTab('tracker')}>
          Tracker
        </button>
        <button className={`nav-tab ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
          Statistics
        </button>
      </div>
      <button className='logout-button' onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navigation;
