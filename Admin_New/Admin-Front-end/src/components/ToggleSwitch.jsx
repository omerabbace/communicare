import React from 'react';
import '../styles/ToggleSwitch.css';

const ToggleSwitch = ({ isActive, handleToggle }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isActive} onChange={handleToggle} />
      <span className="slider round"></span>
      <span className="toggle-label">{isActive ? 'Active' : ''}</span>
    </label>
  );
};

export default ToggleSwitch;
