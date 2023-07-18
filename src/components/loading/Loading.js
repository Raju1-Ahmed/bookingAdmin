import React, { useState } from 'react';
import './loading.css'

const Loading = () => {
   
    return (
        <div className="spinner-overlay">
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      </div>
    );
};

export default Loading;