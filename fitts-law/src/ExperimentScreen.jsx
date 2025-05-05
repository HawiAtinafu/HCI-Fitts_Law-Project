import React, { useState, useRef, useEffect } from 'react';

export default function ExperimentScreen({ 
  participantId, 
  trials, 
  currentTrialIndex, 
  experimentData, 
  onTerminate, 
  onComplete,
  onTrialComplete
}) {
  const [showTarget, setShowTarget] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [mouseTravel, setMouseTravel] = useState(0);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [trialFeedback, setTrialFeedback] = useState(false);
  const centerButtonRef = useRef(null);
  
  const currentTrial = trials[currentTrialIndex] || { size: 0, distance: 0, direction: 'left' };
  const targetSize = currentTrial.size;
  const distance = currentTrial.distance;
  const direction = currentTrial.direction;
  
  // Calculate target position
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
  const targetX = direction === 'right' 
    ? centerX + distance 
    : centerX - distance;
  
  // Track mouse movement
  const handleMouseMove = (e) => {
    if (showTarget && startTime) {
      const currentPos = { x: e.clientX, y: e.clientY };
      const distance = Math.sqrt(
        Math.pow(currentPos.x - lastPosition.x, 2) + 
        Math.pow(currentPos.y - lastPosition.y, 2)
      );
      setMouseTravel(mouseTravel + distance);
      setLastPosition(currentPos);
    }
  };
  
  // Start a new trial
  const startTrial = () => {
    // Ensure the cursor is centered
    if (centerButtonRef.current) {
      const rect = centerButtonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setLastPosition({ x: centerX, y: centerY });
    }
    
    setShowTarget(true);
    setStartTime(Date.now());
    setErrors(0);
    setMouseTravel(0);
  };
  
  // Handle background click (error)
  const handleBackgroundClick = () => {
    if (showTarget) {
      setErrors(errors + 1);
    }
  };
  
  // Handle successful target click
  const handleTargetClick = () => {
    if (!showTarget) return;
    
    const endTime = Date.now();
    const trialTime = endTime - startTime;
    
    // Record trial data
    const trialData = {
      participantId,
      trialNumber: currentTrialIndex + 1,
      targetSize: targetSize,
      distance: distance,
      direction: direction,
      timeMs: trialTime,
      distanceTraveled: mouseTravel,
      errorCount: errors
    };
    
    setShowTarget(false);
    
    // Show trial completion feedback
    setTrialFeedback(true);
    
    // Move to next trial or end experiment after a brief delay
    setTimeout(() => {
      setTrialFeedback(false);
      onTrialComplete(trialData);
    }, 1000); // Show feedback for 1 second
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center h-screen w-full"
      onMouseMove={handleMouseMove}
      onClick={handleBackgroundClick}
    >
      <div className="absolute top-4 left-4 text-xl">
        <p>Participant ID: {participantId}</p>
        <p>Trial: {currentTrialIndex + 1} / {trials.length}</p>
      </div>
      
      <button 
        onClick={onTerminate}
        className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded text-2xl hover:bg-red-700"
      >
        Terminate Experiment
      </button>
      
      {!showTarget ? (
        <button 
          ref={centerButtonRef}
          onClick={startTrial}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          style={{
            position: 'absolute',
            left: `${centerX - 60}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '120px',
          }}
        >
          Next Trial
        </button>
      ) : (
        <button 
          onClick={handleTargetClick}
          className="bg-green-500 rounded-lg hover:bg-green-600"
          style={{
            position: 'absolute',
            left: `${targetX - targetSize/2}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: `${targetSize}px`,
            height: `${targetSize}px`,
          }}
        />
      )}
      
      {/* Trial completion feedback */}
      {trialFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl font-bold text-green-600">Target Acquired!</p>
            <p className="mt-2">Preparing next trial...</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 text-sm">
        <p>Size: {targetSize}px, Distance: {distance}px, Direction: {direction}</p>
      </div>
    </div>
  );
}