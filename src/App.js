import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainComponent from './components/MainComponent';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="/callback" element={<MainComponent />} />
      </Routes>
    </div>
  );
}

export default App;
