// // import React, { useRef, useState, useEffect } from 'react';
// // import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';

// // const VideoPlayer = ({ onTimeUpdate, markers, addMarker, deleteMarker, setCurrentTime }) => {
// //   const videoRef = useRef(null);
// //   const containerRef = useRef(null);
// //   const [isDrawing, setIsDrawing] = useState(false);
// //   const [shapeType, setShapeType] = useState(null);
// //   const [newShape, setNewShape] = useState(null);
// //   const [videoDimensions, setVideoDimensions] = useState({ width: 600, height: 400 });
// //   const [activeMarkers, setActiveMarkers] = useState([]);
// //   const [isFormOpen, setIsFormOpen] = useState(false);
// //   const [formData, setFormData] = useState({ duration: 5, message: '' });
// //   const [freehandPoints, setFreehandPoints] = useState([]);

// //   const handleTimeUpdate = () => {
// //     if (videoRef.current) {
// //       onTimeUpdate(videoRef.current.currentTime);
// //       updateActiveMarkers(videoRef.current.currentTime);
// //     }
// //   };

// //   useEffect(() => {
// //     const video = videoRef.current;
// //     if (video) {
// //       video.addEventListener('loadedmetadata', () => {
// //         const aspectRatio = video.videoWidth / video.videoHeight;
// //         const maxWidth = containerRef.current.clientWidth;
// //         const maxHeight = containerRef.current.clientHeight;

// //         let width = maxWidth;
// //         let height = maxWidth / aspectRatio;

// //         if (height > maxHeight) {
// //           height = maxHeight;
// //           width = maxHeight * aspectRatio;
// //         }

// //         setVideoDimensions({
// //           width: width,
// //           height: height,
// //         });
// //       });
// //     }
// //   }, []);

// //   const updateActiveMarkers = (currentTime) => {
// //     setActiveMarkers(
// //       markers.filter((marker) => currentTime >= marker.time && currentTime <= marker.time + marker.duration)
// //     );
// //   };

// //   const handleMouseDown = (e) => {
// //     startDrawing(e.target.getStage().getPointerPosition());
// //   };

// //   const handleMouseMove = (e) => {
// //     if (isDrawing) {
// //       const pos = e.target.getStage().getPointerPosition();
// //       if (shapeType === 'freehand') {
// //         addPoint(pos);
// //       } else {
// //         continueDrawing(pos);
// //       }
// //     }
// //   };

// //   const handleMouseUp = () => {
// //     finishDrawing();
// //   };

// //   const handleTouchStart = (e) => {
// //     e.preventDefault();
// //     startDrawing(e.target.getStage().getPointerPosition());
// //   };

// //   const handleTouchMove = (e) => {
// //     e.preventDefault();
// //     if (isDrawing) {
// //       const pos = e.target.getStage().getPointerPosition();
// //       if (shapeType === 'freehand') {
// //         addPoint(pos);
// //       } else {
// //         continueDrawing(pos);
// //       }
// //     }
// //   };

// //   const handleTouchEnd = (e) => {
// //     e.preventDefault();
// //     finishDrawing();
// //   };

// //   const startDrawing = ({ x, y }) => {
// //     if (!shapeType) return;
// //     setIsDrawing(true);
// //     if (shapeType === 'rect') {
// //       setNewShape({ x, y, width: 0, height: 0, type: 'rect' });
// //     } else if (shapeType === 'circle') {
// //       setNewShape({ x, y, radius: 0, type: 'circle' });
// //     } else if (shapeType === 'freehand') {
// //       setFreehandPoints([{ x, y }]);
// //     }
// //   };

// //   const continueDrawing = ({ x, y }) => {
// //     if (!isDrawing || !newShape) return;
// //     if (shapeType === 'rect') {
// //       setNewShape({ ...newShape, width: x - newShape.x, height: y - newShape.y });
// //     } else if (shapeType === 'circle') {
// //       setNewShape({ ...newShape, radius: Math.sqrt(Math.pow(x - newShape.x, 2) + Math.pow(y - newShape.y, 2)) });
// //     }
// //   };

// //   const addPoint = ({ x, y }) => {
// //     setFreehandPoints([...freehandPoints, { x, y }]);
// //   };

// //   const finishDrawing = () => {
// //     setIsDrawing(false);
// //     if (newShape) {
// //       setIsFormOpen(true);
// //     }
// //   };

// //   const toggleShapeType = (type) => {
// //     setShapeType((prevType) => (prevType === type ? null : type));
// //   };

// //   const handleFormSubmit = (e) => {
// //     e.preventDefault();
// //     addMarker({ ...newShape, ...formData });
// //     setNewShape(null);
// //     setFreehandPoints([]); // Clear freehand points
// //     setIsFormOpen(false);
// //     setFormData({ duration: 5, message: '' });
// //   };

// //   const handleFormChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData({ ...formData, [name]: value });
// //   };

// //   const handleCancel = () => {
// //     setIsFormOpen(false);
// //     setNewShape(null); // Remove the new shape since the user cancelled
// //     setFreehandPoints([]); // Clear freehand points
// //   };

// //   const jumpToTimestamp = (timestamp) => {
// //     if (videoRef.current) {
// //       videoRef.current.currentTime = timestamp;
// //       setCurrentTime(timestamp);
// //     }
// //   };

// //   return (
// //     <div  className="flex w-full h-full relative">
// //       <div className="flex-1 relative">
// //         <input
// //           type="file"
// //           accept="video/*"
// //           onChange={(e) => {
// //             if (e.target.files[0]) {
// //               const video = videoRef.current;
// //               video.src = URL.createObjectURL(e.target.files[0]);
// //             }
// //           }}
// //           className="mb-2 p-2 border-2 border-gray-300 rounded-lg"
// //         />
// //         <div className="mb-2">
// //           <button
// //             onClick={() => toggleShapeType('rect')}
// //             className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'rect' ? 'bg-blue-300' : 'bg-gray-300'}`}
// //           >
// //             Rectangle
// //           </button>
// //           <button
// //             onClick={() => toggleShapeType('circle')}
// //             className={`mr-2 p-2 border-2 border-gray-300 rounded-md ${shapeType === 'circle' ? 'bg-blue-300' : 'bg-gray-300'}`}
// //           >
// //             Circle
// //           </button>
// //           <button
// //             onClick={() => toggleShapeType('freehand')}
// //             className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'freehand' ? 'bg-blue-300' : 'bg-gray-300'}`}
// //           >
// //             Freehand
// //           </button>
// //         </div>
// //         <div ref={containerRef} className="relative w-full h-full">
// //           <video
// //             ref={videoRef}
// //             controls
// //             onTimeUpdate={handleTimeUpdate}
// //              className="absolute top-0 left-0 w-full h-full z-1"
// //             style={{ width: `${videoDimensions.width}px`, height: `${videoDimensions.height}px` }}
// //           />
// //           <Stage
// //             width={videoDimensions.width}
// //             height={videoDimensions.height}
// //             style={{ position: 'absolute', top: '0', left: '0', zIndex: 2, pointerEvents: shapeType ? 'auto' : 'none' }}
// //             onMouseDown={handleMouseDown}
// //             onMouseMove={handleMouseMove}
// //             onMouseUp={handleMouseUp}
// //             onTouchStart={handleTouchStart}
// //             onTouchMove={handleTouchMove}
// //             onTouchEnd={handleTouchEnd}
// //           >
// //             <Layer>
// //               {activeMarkers.map((marker, index) => (
// //                 <Group key={index}>
// //                   {marker.type === 'rect' ? (
// //                     <Rect x={marker.x} y={marker.y} width={marker.width} height={marker.height} stroke="blue" />
// //                   ) : marker.type === 'circle' ? (
// //                     <Circle x={marker.x} y={marker.y} radius={marker.radius} stroke="red" />
// //                   ) : (
// //                     <Line
// //                       points={marker.points.flatMap(p => [p.x, p.y])}
// //                       stroke="green"
// //                       strokeWidth={2}
// //                       lineCap="round"
// //                       lineJoin="round"
// //                     />
// //                   )}
// //                   <Text
// //                     text={marker.message}
// //                     fontSize={16}
// //                     fill="black"
// //                     padding={10}
// //                     backgroundColor="white"
// //                     x={marker.x - 60}
// //                     y={marker.y - 30} // Position above the marker
// //                     width={200} // Adjust width as needed
// //                     wrap="word"
// //                     align="center"
// //                   />
// //                 </Group>
// //               ))}
// //               {newShape &&
// //                 (newShape.type === 'rect' ? (
// //                   <Rect x={newShape.x} y={newShape.y} width={newShape.width} height={newShape.height} stroke="red" />
// //                 ) : newShape.type === 'circle' ? (
// //                   <Circle x={newShape.x} y={newShape.y} radius={newShape.radius} stroke="blue" />
// //                 ) :  (
// //                   <Line
// //                     points={freehandPoints.flatMap(p => [p.x, p.y])}
// //                     stroke="blue"
// //                     strokeWidth={2}
// //                     lineCap="round"
// //                     lineJoin="round"
// //                   />
// //                 ))}
// //             </Layer>
// //           </Stage>
// //         </div>
// //       </div>
// //       <div  className="w-1/4 bg-gray-300 p-4 overflow-y-auto">
// //         <h2 className="text-lg font-bold mb-2 p-2 bg-blue-300">Markers</h2>
// //         {markers.map((marker, index) => (
// //            <div key={index} className="items-center mb-2 p-2 bg-green-300">
// //             <div>
// //               <strong>Time:</strong> {marker.time.toFixed(2)}s
// //             </div>
// //             <div>
// //               <strong>Duration:</strong> {marker.duration}s
// //             </div>
// //             <div>
// //               <strong>Message:</strong> {marker.message}
// //             </div>
// //             <button onClick={() => jumpToTimestamp(marker.time)} className="bg-blue-500 hover:bg-blue-600 mr-2 px-2 py-0.5 rounded-md mt-1">Jump</button>
// //             <button onClick={(e) => { e.stopPropagation(); deleteMarker(index);}}  className="bg-red-300 hover:bg-red-500 px-2 py-0.5 rounded-md mt-1">Delete</button>
// //           </div>
// //         ))}
// //       </div>
// //       {isFormOpen && (
// //           <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
// //             <div className="bg-white p-6 rounded shadow-lg">
// //               <form onSubmit={handleFormSubmit} className="space-y-4">
// //                 <div>
// //                   <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
// //                     Duration (seconds)
// //                   </label>
// //                   <input
// //                     type="number"
// //                     name="duration"
// //                     value={formData.duration}
// //                     onChange={handleFormChange}
// //                     min="1"
// //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label htmlFor="message" className="block text-sm font-medium text-gray-700">
// //                     Message
// //                   </label>
// //                   <textarea
// //                     name="message"
// //                     value={formData.message}
// //                     onChange={handleFormChange}
// //                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
// //                   />
// //                 </div>
// //                 <div className="flex justify-between space-x-2">
// //                   <button
// //                     type="button"
// //                     onClick={handleCancel}
// //                     className="px-4 py-2 bg-gray-300 hover:bg-gray-500 rounded shadow"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700">
// //                     Save
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //   );
// // };

// // export default VideoPlayer;


// import React, { useRef, useState, useEffect } from 'react';
// import { Stage, Layer, Rect, Circle, Line } from 'react-konva';

// const VideoPlayer = ({ onTimeUpdate, markers, addMarker, deleteMarker, setCurrentTime }) => {
//   const videoRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [shapeType, setShapeType] = useState(null);
//   const [newShape, setNewShape] = useState(null);
//   const [videoDimensions, setVideoDimensions] = useState({ width: 600, height: 400 });
//   const [originalDimensions, setOriginalDimensions] = useState({ width: 600, height: 400 });
//   const [activeMarkers, setActiveMarkers] = useState([]);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [formData, setFormData] = useState({ duration: 5, message: '' });
//   const [freehandPoints, setFreehandPoints] = useState([]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (containerRef.current) {
//         const aspectRatio = originalDimensions.width / originalDimensions.height;
//         const maxWidth = containerRef.current.clientWidth;
//         const maxHeight = containerRef.current.clientHeight;

//         let width = maxWidth;
//         let height = maxWidth / aspectRatio;

//         if (height > maxHeight) {
//           height = maxHeight;
//           width = maxHeight * aspectRatio;
//         }

//         setVideoDimensions({ width, height });
//       }
//     };

//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, [originalDimensions]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (video) {
//       video.addEventListener('loadedmetadata', () => {
//         setOriginalDimensions({
//           width: video.videoWidth,
//           height: video.videoHeight,
//         });
//         handleResize(); 
//       });
//     }
//   }, []);

//   const handleTimeUpdate = () => {
//     if (videoRef.current) {
//       onTimeUpdate(videoRef.current.currentTime);
//       updateActiveMarkers(videoRef.current.currentTime);
//     }
//   };

//   const updateActiveMarkers = (currentTime) => {
//     setActiveMarkers(
//       markers.filter((marker) => currentTime >= marker.time && currentTime <= marker.time + marker.duration)
//     );
//   };

//   const handleMouseDown = (e) => {
//     if (!shapeType) return;
//     const pos = e.target.getStage().getPointerPosition();
//     if (shapeType === 'text') {
//       setNewShape({ x: pos.x, y: pos.y, text: '', type: 'text' });
//       setIsFormOpen(true);
//     } else {
//       setIsDrawing(true);
//       startDrawing(pos);
//     }
//   };

//   const handleMouseMove = (e) => {
//     if (isDrawing) {
//       const pos = e.target.getStage().getPointerPosition();
//       if (shapeType === 'freehand') {
//         addPoint(pos);
//       } else {
//         continueDrawing(pos);
//       }
//     }
//   };

//   const handleMouseUp = () => {
//     finishDrawing();
//   };

//   const handleTouchStart = (e) => {
//     e.preventDefault();
//     startDrawing(e.target.getStage().getPointerPosition());
//   };

//   const handleTouchMove = (e) => {
//     e.preventDefault();
//     if (isDrawing) {
//       const pos = e.target.getStage().getPointerPosition();
//       if (shapeType === 'freehand') {
//         addPoint(pos);
//       } else {
//         continueDrawing(pos);
//       }
//     }
//   };

//   const handleTouchEnd = (e) => {
//     e.preventDefault();
//     finishDrawing();
//   };

//   const startDrawing = ({ x, y }) => {
//     if (!shapeType) return;
//     setIsDrawing(true);
//     if (shapeType === 'rect') {
//       setNewShape({ x, y, width: 0, height: 0, type: 'rect' });
//     } else if (shapeType === 'circle') {
//       setNewShape({ x, y, radius: 0, type: 'circle' });
//     } else if (shapeType === 'freehand') {
//       setFreehandPoints([{ x, y }]);
//     }
//   };

//   const continueDrawing = ({ x, y }) => {
//     if (!isDrawing || !newShape) return;
//     if (shapeType === 'rect') {
//       setNewShape({ ...newShape, width: x - newShape.x, height: y - newShape.y });
//     } else if (shapeType === 'circle') {
//       setNewShape({ ...newShape, radius: Math.sqrt(Math.pow(x - newShape.x, 2) + Math.pow(y - newShape.y, 2)) });
//     }
//   };

//   const addPoint = ({ x, y }) => {
//     setFreehandPoints([...freehandPoints, { x, y }]);
//   };

//   const finishDrawing = () => {
//     setIsDrawing(false);
//     if (newShape || freehandPoints.length > 1) {
//       setIsFormOpen(true);
//     }
//   };

//   const toggleShapeType = (type) => {
//     setShapeType((prevType) => (prevType === type ? null : type));
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();
//     if (shapeType === 'freehand') {
//       addMarker({ points: freehandPoints, type: 'freehand', ...formData });
//       setFreehandPoints([]); // Clear freehand points
//     } else {
//       addMarker({ ...newShape, ...formData });
//       setNewShape(null);
//     }
//     setIsFormOpen(false);
//     setFormData({ duration: 5, message: '' });
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleCancel = () => {
//     setIsFormOpen(false);
//     setNewShape(null);
//     setFreehandPoints([]);
//   };

//   const jumpToTimestamp = (timestamp) => {
//     if (videoRef.current) {
//       videoRef.current.currentTime = timestamp;
//       setCurrentTime(timestamp);
//     }
//   };

//   const calculateScaleFactor = () => {
//     return {
//       x: videoDimensions.width / originalDimensions.width,
//       y: videoDimensions.height / originalDimensions.height,
//     };
//   };

//   const scaleShape = (shape, scaleFactor) => {
//     if (shape.type === 'rect') {
//       return {
//         ...shape,
//         x: shape.x * scaleFactor.x,
//         y: shape.y * scaleFactor.y,
//         width: shape.width * scaleFactor.x,
//         height: shape.height * scaleFactor.y,
//       };
//     } else if (shape.type === 'circle') {
//       return {
//         ...shape,
//         x: shape.x * scaleFactor.x,
//         y: shape.y * scaleFactor.y,
//         radius: shape.radius * scaleFactor.x,
//       };
//     } else if (shape.type === 'freehand') {
//       return {
//         ...shape,
//         points: shape.points.map((point) => ({
//           x: point.x * scaleFactor.x,
//           y: point.y * scaleFactor.y,
//         })),
//       };
//     }
//     return shape;
//   };

//   const scaleFactor = calculateScaleFactor();

//   return (
//     <div className="flex w-full h-full relative">
//       <div className="flex-1 relative">
//         <input
//           type="file"
//           accept="video/*"
//           onChange={(e) => {
//             if (e.target.files[0]) {
//               const video = videoRef.current;
//               video.src = URL.createObjectURL(e.target.files[0]);
//               // video.play(); // Play video automatically when file is loaded
//             }
//           }}
//           className="mb-2 p-2 border-2 border-gray-300 rounded-lg"
//         />
//         <div className="mb-2">
//           <button
//             onClick={() => toggleShapeType('rect')}
//             className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'rect' ? 'bg-blue-300' : 'bg-gray-300'}`}
//           >
//             Rectangle
//           </button>
//           <button
//             onClick={() => toggleShapeType('circle')}
//             className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'circle' ? 'bg-blue-300' : 'bg-gray-300'}`}
//           >
//             Circle
//           </button>
//           <button
//             onClick={() => toggleShapeType('freehand')}
//             className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'freehand' ? 'bg-blue-300' : 'bg-gray-300'}`}
//           >
//             Freehand
//           </button>
//         </div>
//         <div ref={containerRef} className="relative w-full h-full">
//         <video
//           ref={videoRef}
//           onTimeUpdate={handleTimeUpdate}
//           controls
//           className="absolute top-0 left-0 z-1"
//           style={{ width: `${videoDimensions.width}px`, height: `${videoDimensions.height}px` }}
//         />
//         <Stage
//           width={videoDimensions.width}
//           height={videoDimensions.height}
//           style={{ position: 'absolute', top: '0', left: '0', zIndex: 2, pointerEvents: shapeType ? 'auto' : 'none' }}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           <Layer>
//             {activeMarkers.map((marker, index) => {
//               const scaledMarker = scaleShape(marker, scaleFactor);
//               if (scaledMarker.type === 'rect') {
//                 return <Rect key={index} {...scaledMarker} stroke="red" strokeWidth={2} />;
//               } else if (scaledMarker.type === 'circle') {
//                 return <Circle key={index} {...scaledMarker} stroke="blue" strokeWidth={2} />;
//               } else if (scaledMarker.type === 'freehand') {
//                 return (
//                   <Line
//                     key={index}
//                     points={scaledMarker.points.flatMap((point) => [point.x, point.y])}
//                     stroke="green"
//                     strokeWidth={2}
//                     tension={0.5}
//                     lineCap="round"
//                     lineJoin="round"
//                   />
//                 );
//               }
//               return null;
//             })}
//             {newShape && shapeType === 'rect' && <Rect {...newShape} stroke="red" strokeWidth={2} />}
//             {newShape && shapeType === 'circle' && <Circle {...newShape} stroke="blue" strokeWidth={2} />}
//             {shapeType === 'freehand' && freehandPoints.length > 1 && (
//               <Line
//                 points={freehandPoints.flatMap((point) => [point.x, point.y])}
//                 stroke="green"
//                 strokeWidth={2}
//                 tension={0.5}
//                 lineCap="round"
//                 lineJoin="round"
//               />
//             )}
//           </Layer>
//         </Stage>
//       </div>
//       <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
//         <h2 className="text-lg font-bold mb-2 p-2 bg-blue-300">Markers</h2>
//         {markers.map((marker, index) => (
//           <div key={index} className="mb-2 p-2 border border-gray-300 rounded-md">
//             <p><strong>Time: </strong>{marker.time.toFixed(2)}s</p>
//             <p><strong>Duration: </strong>{marker.duration}s</p>
//             <p><strong>Message: </strong>{marker.message}</p>
//             <button
//               onClick={() => jumpToTimestamp(marker.time)}
//               className="mr-2 p-1 bg-blue-300 rounded-lg"
//             >
//               Jump to
//             </button>
//             <button onClick={() => deleteMarker(index)} className="p-1 bg-red-300 rounded-lg">
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//       {isFormOpen && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
//             <div className="bg-white p-6 rounded shadow-lg">
//               <form onSubmit={handleFormSubmit} className="space-y-4">
//                 <div>
//                   <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
//                     Duration (seconds)
//                   </label>
//                   <input
//                     type="number"
//                     name="duration"
//                     value={formData.duration}
//                     onChange={handleFormChange}
//                     min="1"
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="message" className="block text-sm font-medium text-gray-700">
//                     Message
//                   </label>
//                   <textarea
//                     name="message"
//                     value={formData.message}
//                     onChange={handleFormChange}
//                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
//                   />
//                 </div>
//                 <div className="flex justify-between space-x-2">
//                   <button
//                     type="button"
//                     onClick={handleCancel}
//                     className="px-4 py-2 bg-gray-300 hover:bg-gray-500 rounded shadow"
//                   >
//                     Cancel
//                   </button>
//                   <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700">
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//       )}
//     </div>
//   </div>
//   );
// };

// export default VideoPlayer;


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
    if (!shapeType) return;
    const pos = e.target.getStage().getPointerPosition();
    if (shapeType === 'text') {
      setNewShape({ x: pos.x, y: pos.y, text: '', type: 'text' });
      setIsFormOpen(true);
    } else {
      setIsDrawing(true);
      startDrawing(pos);
    }
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
    if (newShape || freehandPoints.length > 1) {
      setIsFormOpen(true);
    }
  };

  const toggleShapeType = (type) => {
    setShapeType((prevType) => (prevType === type ? null : type));
  };

 const handleFormSubmit = (e) => {
    e.preventDefault();
    if (shapeType === 'freehand') {
      addMarker({ points: freehandPoints, type: 'freehand', ...formData });
      setFreehandPoints([]); 
    } else {
      addMarker({ ...newShape, ...formData });
      setNewShape(null);
    }
    setIsFormOpen(false);
    setFormData({ duration: 5, message: '' });
    setIsDrawing(false);
    setShapeType(null);
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setNewShape(null);
    setFreehandPoints([]);
    setIsDrawing(false);
    setShapeType(null);
  };

  const jumpToTimestamp = (timestamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      setCurrentTime(timestamp);
    }
  };


  return (
    <div  className="flex w-full h-full relative">
      <div className="flex-1 relative">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              const video = videoRef.current;
              video.src = URL.createObjectURL(e.target.files[0]);
            }
          }}
          className="mb-2 p-2 border-2 border-gray-300 rounded-lg"
        />
        <div className="mb-2">
          <button
            onClick={() => toggleShapeType('rect')}
            className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'rect' ? 'bg-blue-300' : 'bg-gray-300'}`}
          >
            Rectangle
          </button>
          <button
            onClick={() => toggleShapeType('circle')}
            className={`mr-2 p-2 border-2 border-gray-300 rounded-md ${shapeType === 'circle' ? 'bg-blue-300' : 'bg-gray-300'}`}
          >
            Circle
          </button>
          <button
            onClick={() => toggleShapeType('freehand')}
            className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'freehand' ? 'bg-blue-300' : 'bg-gray-300'}`}
          >
            Freehand
          </button>
          <button
            onClick={() => toggleShapeType('text')}
            className={`mr-2 p-2 border-2 border-gray-300 rounded-lg ${shapeType === 'text' ? 'bg-blue-300' : 'bg-gray-300'}`}
          >
            Text
          </button>
        </div>
        <div ref={containerRef} className="relative w-full h-full">
          <video
            ref={videoRef}
            controls
            onTimeUpdate={handleTimeUpdate}
            className="absolute top-0 left-0 z-1"
            style={{ width: `${videoDimensions.width}px`, height: `${videoDimensions.height}px` }}
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
                <Group key ={index}>
                  {marker.type === 'rect' ? (
                    <Rect x={marker.x} y={marker.y} width={marker.width} height={marker.height} stroke="blue" fontSize={16}  fill="blue" opacity={0.4} />
                  ) : marker.type === 'circle' ? (
                    <Circle x={marker.x} y={marker.y} radius={marker.radius} stroke="green" fill="green" opacity={0.5} />
                  ) : marker.type === 'freehand' ? (
                    <Line points={marker.points.flatMap((point) => [point.x, point.y])} stroke="purple" strokeWidth={2}  tension={0.5} lineCap="round" lineJoin="round"/>
                  ) : (
                  
                  <Text text={marker.message}
                        fontSize={16}
                        fill="black"
                        padding={10}
                        backgroundColor="white"
                        x={marker.x}
                        y={marker.y} 
                        wrap="word"
                        align="center"
                        />
                  )}
                </Group>
              ))}
              {newShape && shapeType === 'rect' && <Rect {...newShape} stroke="black" strokeWidth={2} />}
            {newShape && shapeType === 'circle' && <Circle {...newShape} stroke="black" strokeWidth={2} />}
            {shapeType === 'freehand' && freehandPoints.length > 1 && (
              <Line
                points={freehandPoints.flatMap((point) => [point.x, point.y])}
                stroke="black"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            )}
            </Layer>
          </Stage>

        </div>
      </div>
      <div  className="w-1/4 bg-gray-300 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2 p-2 bg-blue-300">Markers</h2>
        {markers.map((marker, index) => (
           <div key={index} className="items-center mb-2 p-2 bg-green-300">
            <div>
              <strong>Type: </strong> {marker.type}
            </div>
            <div>
              <strong>Time: </strong> {marker.time.toFixed(2)}s
            </div>
            <div>
              <strong>Duration: </strong> {marker.duration}s
            </div>
            <div>
              <strong>Message: </strong> {marker.message}
            </div>
            <button onClick={() => jumpToTimestamp(marker.time)} className="bg-blue-500 hover:bg-blue-600 mr-2 px-2 py-0.5 rounded-md mt-1">Jump</button>
            <button onClick={(e) => { e.stopPropagation(); deleteMarker(index);}}  className="bg-red-300 hover:bg-red-500 px-2 py-0.5 rounded-md mt-1">Delete</button>
          </div>
        ))}
      </div>
      {isFormOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-30">
            <div className="bg-white p-6 rounded shadow-lg">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleFormChange}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-500 rounded shadow"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

export default VideoPlayer;


