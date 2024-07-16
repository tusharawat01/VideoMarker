// src/components/VideoPlayerWithCanvas.jsx

import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';

const VideoPlayerWithCanvas = ({ onTimeUpdate, markers, addMarker, deleteMarker }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState(null);
  const [newShape, setNewShape] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 600, height: 400 });

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };


  const handleMouseDown = (e) => {
    if (!shapeType) return;
    setIsDrawing(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    if (shapeType === 'rect') {
      setNewShape({ x, y, width: 0, height: 0, type: 'rect' });
    } else if (shapeType === 'circle') {
      setNewShape({ x, y, radius: 0, type: 'circle' });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !newShape) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    if (shapeType === 'rect') {
      setNewShape({ ...newShape, width: x - newShape.x, height: y - newShape.y });
    } else if (shapeType === 'circle') {
      setNewShape({ ...newShape, radius: Math.sqrt(Math.pow(x - newShape.x, 2) + Math.pow(y - newShape.y, 2)) });
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (newShape) {
      addMarker(newShape);
    }
    setNewShape(null);
  };

  const toggleShapeType = (type) => {
    setShapeType((prevType) => (prevType === type ? null : type));
  };

  return (
    <div>
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
      </div>
      <div ref={containerRef} style={{ position: 'relative', width: videoDimensions.width, height: videoDimensions.height }}>
        <video
          ref={videoRef}
          controls
          onTimeUpdate={handleTimeUpdate}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
        />
        <Stage
          width={videoDimensions.width}
          height={videoDimensions.height}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 2, pointerEvents: shapeType ? 'auto' : 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <Layer>
            {markers.map((marker, index) => (
              <Group key={index}>
                {marker.type === 'rect' ? (
                  <Rect x={marker.x} y={marker.y} width={marker.width} height={marker.height} stroke="red" />
                ) : (
                  <Circle x={marker.x} y={marker.y} radius={marker.radius} stroke="red" />
                )}
                <Text
                  text="x"
                  fontSize={15}
                  fill="red"
                  x={marker.x - 10}
                  y={marker.y - 10}
                  onClick={() => deleteMarker(index)}
                />
              </Group>
            ))}
            {newShape &&
              (newShape.type === 'rect' ? (
                <Rect x={newShape.x} y={newShape.y} width={newShape.width} height={newShape.height} stroke="blue" />
              ) : (
                <Circle x={newShape.x} y={newShape.y} radius={newShape.radius} stroke="blue" />
              ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default VideoPlayerWithCanvas;
