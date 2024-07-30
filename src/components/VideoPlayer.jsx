import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';

const VideoPlayer = ({ onTimeUpdate, markers, addMarker, deleteMarker, setCurrentTime }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState(null);
  const [newShape, setNewShape] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 600, height: 400 });
  const [activeMarkers, setActiveMarkers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ duration: 5, message: '' });
  const [freehandPoints, setFreehandPoints] = useState([]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
      updateActiveMarkers(videoRef.current.currentTime);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadedmetadata', () => {
        const aspectRatio = video.videoWidth / video.videoHeight;
        const maxWidth = containerRef.current.clientWidth;
        const maxHeight = containerRef.current.clientHeight;

        let width = maxWidth;
        let height = maxWidth / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }

        setVideoDimensions({
          width: width,
          height: height,
        });
      });
    }
  }, []);

  const updateActiveMarkers = (currentTime) => {
    setActiveMarkers(
      markers.filter((marker) => currentTime >= marker.time && currentTime <= marker.time + marker.duration)
    );
  };

  const handleMouseDown = (e) => {
    startDrawing(e.target.getStage().getPointerPosition());
  };

  const handleMouseMove = (e) => {
    if (isDrawing) {
      const pos = e.target.getStage().getPointerPosition();
      if (shapeType === 'freehand') {
        addPoint(pos);
      } else {
        continueDrawing(pos);
      }
    }
  };

  const handleMouseUp = () => {
    finishDrawing();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    startDrawing(e.target.getStage().getPointerPosition());
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDrawing) {
      const pos = e.target.getStage().getPointerPosition();
      if (shapeType === 'freehand') {
        addPoint(pos);
      } else {
        continueDrawing(pos);
      }
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    finishDrawing();
  };

  const startDrawing = ({ x, y }) => {
    if (!shapeType) return;
    setIsDrawing(true);
    if (shapeType === 'rect') {
      setNewShape({ x, y, width: 0, height: 0, type: 'rect' });
    } else if (shapeType === 'circle') {
      setNewShape({ x, y, radius: 0, type: 'circle' });
    } else if (shapeType === 'freehand') {
      setFreehandPoints([{ x, y }]);
    }
  };

  const continueDrawing = ({ x, y }) => {
    if (!isDrawing || !newShape) return;
    if (shapeType === 'rect') {
      setNewShape({ ...newShape, width: x - newShape.x, height: y - newShape.y });
    } else if (shapeType === 'circle') {
      setNewShape({ ...newShape, radius: Math.sqrt(Math.pow(x - newShape.x, 2) + Math.pow(y - newShape.y, 2)) });
    }
  };

  const addPoint = ({ x, y }) => {
    setFreehandPoints([...freehandPoints, { x, y }]);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    if (newShape) {
      setIsFormOpen(true);
    }
  };

  const toggleShapeType = (type) => {
    setShapeType((prevType) => (prevType === type ? null : type));
  };

  const handleMarkerClick = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addMarker({ ...newShape, ...formData });
    setNewShape(null);
    setFreehandPoints([]); // Clear freehand points
    setIsFormOpen(false);
    setFormData({ duration: 5, message: '' });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setNewShape(null); // Remove the new shape since the user cancelled
    setFreehandPoints([]); // Clear freehand points
  };

  const jumpToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              const video = videoRef.current;
              video.src = URL.createObjectURL(e.target.files[0]);
            }
          }}
        />
        <div style={{ margin: '10px 0' }}>
          <button onClick={() => toggleShapeType('rect')} style={{ backgroundColor: shapeType === 'rect' ? 'lightblue' : '' }}>Rectangle</button>
          <button onClick={() => toggleShapeType('circle')} style={{ backgroundColor: shapeType === 'circle' ? 'lightblue' : '' }}>Circle</button>
          <button onClick={() => toggleShapeType('freehand')} style={{ backgroundColor: shapeType === 'freehand' ? 'lightblue' : '' }}>Freehand</button>
        </div>
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
          <video
            ref={videoRef}
            controls
            onTimeUpdate={handleTimeUpdate}
            style={{ position: 'absolute', top: '0', left: '0', width: `${videoDimensions.width}px`, height: `${videoDimensions.height}px`, maxWidth: '100%', maxHeight: '100%', zIndex: 1 }}
          />
          <Stage
            width={videoDimensions.width}
            height={videoDimensions.height}
            style={{ position: 'absolute', top: '0', left: '0', zIndex: 2, pointerEvents: shapeType ? 'auto' : 'none' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Layer>
              {activeMarkers.map((marker, index) => (
                <Group key={index}>
                  {marker.type === 'rect' ? (
                    <Rect x={marker.x} y={marker.y} width={marker.width} height={marker.height} stroke="blue" />
                  ) : marker.type === 'circle' ? (
                    <Circle x={marker.x} y={marker.y} radius={marker.radius} stroke="red" />
                  ) : (
                    <Line
                      points={marker.points.flatMap(p => [p.x, p.y])}
                      stroke="green"
                      strokeWidth={2}
                      lineCap="round"
                      lineJoin="round"
                    />
                  )}
                  <Text
                    text={marker.message}
                    fontSize={16}
                    fill="black"
                    padding={10}
                    backgroundColor="white"
                    x={marker.x - 60}
                    y={marker.y - 30} // Position above the marker
                    width={200} // Adjust width as needed
                    wrap="word"
                    align="center"
                  />
                </Group>
              ))}
              {newShape &&
                (newShape.type === 'rect' ? (
                  <Rect x={newShape.x} y={newShape.y} width={newShape.width} height={newShape.height} stroke="red" />
                ) : newShape.type === 'circle' ? (
                  <Circle x={newShape.x} y={newShape.y} radius={newShape.radius} stroke="blue" />
                ) :  (
                  <Line
                    points={freehandPoints.flatMap(p => [p.x, p.y])}
                    stroke="blue"
                    strokeWidth={2}
                    lineCap="round"
                    lineJoin="round"
                  />
                ))}
            </Layer>
          </Stage>
        </div>
      </div>
      <div style={{ width: '300px', padding: '10px', overflowY: 'auto', backgroundColor: '#f0f0f0' }}>
        <h3>Markers</h3>
        {markers.map((marker, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div>
              <strong>Time:</strong> {marker.time.toFixed(2)}s
            </div>
            <div>
              <strong>Duration:</strong> {marker.duration}s
            </div>
            <div>
              <strong>Message:</strong> {marker.message}
            </div>
            <button onClick={() => jumpToTimestamp(marker.time)} style={{ marginRight: '5px' }}>Jump to Time</button>
            <button onClick={(e) => { e.stopPropagation(); deleteMarker(index); }}>Delete</button>
          </div>
        ))}
      </div>
      {isFormOpen && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
          zIndex: 3
        }}>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>
                Duration:
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Message:
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  required
                />
              </label>
            </div>
            <div>
              <button type="submit">Add Marker</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
