import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';

const DrawingTool = ({ markers, addMarker }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeType, setShapeType] = useState('rect');
  const [newShape, setNewShape] = useState(null);

  const handleMouseDown = (e) => {
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

  return (
    <div>
      <button onClick={() => setShapeType('rect')}>Rectangle</button>
      <button onClick={() => setShapeType('circle')}>Circle</button>
      <Stage
        width={600}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {markers.map((marker, index) => (
            marker.type === 'rect' ? (
              <Rect key={index} x={marker.x} y={marker.y} width={marker.width} height={marker.height} stroke="red" />
            ) : (
              <Circle key={index} x={marker.x} y={marker.y} radius={marker.radius} stroke="red" />
            )
          ))}
          {newShape && (newShape.type === 'rect' ? (
            <Rect x={newShape.x} y={newShape.y} width={newShape.width} height={newShape.height} stroke="blue" />
          ) : (
            <Circle x={newShape.x} y={newShape.y} radius={newShape.radius} stroke="blue" />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingTool;
