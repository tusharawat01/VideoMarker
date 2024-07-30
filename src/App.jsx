import React, { useState } from 'react';
import VideoPlayer from './components/VideoPlayer';

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
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <VideoPlayer
        onTimeUpdate={handleTimeUpdate}
        markers={markers}
        addMarker={addMarker}
        deleteMarker={deleteMarker}
        setCurrentTime={setCurrentTime}
      />
    </div>
  );
};

export default App;
