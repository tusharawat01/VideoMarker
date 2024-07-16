// src/App.jsx

import React, { useState } from 'react';
import VideoPlayerWithCanvas from './components/VideoPlayer';

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  const addMarker = (newShape) => {
    setMarkers([...markers, { ...newShape, time: currentTime }]);
  };

  const deleteMarker = (index) => {
    setMarkers(markers.filter((_, i) => i !== index));
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  return (
    <div>
      <VideoPlayerWithCanvas
        onTimeUpdate={handleTimeUpdate}
        markers={markers.filter((marker) => currentTime >= marker.time && currentTime <= marker.time + 5)}
        addMarker={addMarker}
        deleteMarker={deleteMarker}
      />
    </div>
  );
};

export default App;
