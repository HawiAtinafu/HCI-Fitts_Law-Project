import { useState, useEffect, useRef } from "react";

// Main App Component
export default function FittsLawApp() {
  // Application States
  const [screen, setScreen] = useState("welcome"); // welcome, instructions, experiment, results
  const [participantId, setParticipantId] = useState("");
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [experimentData, setExperimentData] = useState([]);
  const [showTarget, setShowTarget] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [errors, setErrors] = useState(0);
  const [mouseTravel, setMouseTravel] = useState(0);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [trialFeedback, setTrialFeedback] = useState(false);
  
  // Configuration constants
  const TARGET_SIZES = [30, 60, 90]; // pixels
  const DISTANCES = [100, 200, 300]; // pixels
  const DIRECTIONS = ["left", "right"];
  const TRIALS_PER_CONFIG = 10;

  // Generate a random ID for the participant
  useEffect(() => {
    if (screen === "welcome") {
      const randomId = "P" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setParticipantId(randomId);
    }
  }, [screen]);

  // Generate all trial configurations
  const generateTrials = () => {
    const allTrials = [];
    TARGET_SIZES.forEach(size => {
      DISTANCES.forEach(distance => {
        DIRECTIONS.forEach(direction => {
          // Each configuration appears TRIALS_PER_CONFIG times
          for (let i = 0; i < TRIALS_PER_CONFIG; i++) {
            allTrials.push({ size, distance, direction });
          }
        });
      });
    });
    
    // Shuffle trials
    return shuffleArray(allTrials);
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Handle consent acceptance
  const handleConsent = () => {
    setScreen("instructions");
  };

  // Start the experiment
  const startExperiment = () => {
    const generatedTrials = generateTrials();
    setTrials(generatedTrials);
    setExperimentData([]);
    setCurrentTrialIndex(0);
    setScreen("experiment");
  };

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

  // Reference to center button
  const centerButtonRef = useRef(null);
  
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
    const currentTrial = trials[currentTrialIndex];
    const trialData = {
      participantId,
      trialNumber: currentTrialIndex + 1,
      targetSize: currentTrial.size,
      distance: currentTrial.distance,
      direction: currentTrial.direction,
      timeMs: trialTime,
      distanceTraveled: mouseTravel,
      errorCount: errors
    };
    
    const updatedData = [...experimentData, trialData];
    setExperimentData(updatedData);
    setShowTarget(false);
    
    // Show trial completion feedback
    setTrialFeedback(true);
    
    // Move to next trial or end experiment after a brief delay
    setTimeout(() => {
      setTrialFeedback(false);
      
      if (currentTrialIndex < trials.length - 1) {
        setCurrentTrialIndex(currentTrialIndex + 1);
      } else {
        downloadCSV(updatedData);
        setScreen("results");
      }
    }, 1000); // Show feedback for 1 second
  };

  // Terminate the experiment early
  const terminateExperiment = () => {
    setScreen("welcome");
  };

  // Download data as CSV
  const downloadCSV = (data) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitts_law_${participantId}.csv`;
    link.click();
  };

  // Render the welcome screen with consent form
  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fitts' Law Experiment</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6 overflow-y-auto max-h-96">
        <h2 className="text-xl font-semibold mb-4">Informed Consent</h2>
        
        <p className="mb-4">You are invited to participate in a research study. The purpose of this study is to measure how fast users can point to and click on targets shown on the screen.</p>
        
        <h3 className="text-lg font-semibold mb-2">Procedures</h3>
        <p className="mb-4">If you agree to participate, you will be asked to complete 180 trials where you click on targets of various sizes and distances. The entire experiment should take approximately 10-15 minutes.</p>
        
        <h3 className="text-lg font-semibold mb-2">Risks and Benefits</h3>
        <p className="mb-4">There are no anticipated risks associated with this study beyond those encountered in everyday computer use. There are no direct benefits to you for participating in this study.</p>
        
        <h3 className="text-lg font-semibold mb-2">Confidentiality</h3>
        <p className="mb-4">Your responses will be kept confidential. Data will be stored securely and will be made available only to persons conducting the study. No reference will be made in oral or written reports which could link you to the study.</p>
        
        <h3 className="text-lg font-semibold mb-2">Participation</h3>
        <p className="mb-4">Your participation in this study is voluntary. You may decline to participate or withdraw from the study at any time without penalty.</p>
        
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="mb-4">If you have questions at any time about the study or the procedures, you may contact the researcher.</p>
      </div>
      
      <p className="mb-6">By clicking "I Agree" below, you confirm that you are 18 years of age or older and consent to participate in this study.</p>
      
      <div className="flex gap-4">
        <button 
          onClick={handleConsent} 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          I Agree
        </button>
        <button 
          onClick={() => window.close()} 
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          I Decline
        </button>
      </div>
    </div>
  );

  // Render the instructions screen
  const renderInstructionsScreen = () => (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Instructions</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="mb-4">In this experiment, you will be asked to click on targets that appear on the screen.</p>
        <p className="mb-4">For each trial:</p>
        <ol className="list-decimal list-inside mb-4">
          <li className="mb-2">First, click on the "Start Trial" button in the center of the screen. <strong>This centers your cursor</strong> to begin the trial.</li>
          <li className="mb-2">A target will appear. Move your cursor to the target and click on it as quickly and accurately as possible.</li>
          <li className="mb-2">If you click outside the target, it will count as an error, but the trial will continue until you successfully click on the target.</li>
          <li className="mb-2">After clicking the target, you'll see a brief confirmation message before the next trial begins.</li>
          <li className="mb-2">For the next trial, you'll need to click the center "Start Trial" button again to ensure your cursor is properly positioned.</li>
        </ol>
        <p className="mb-4">There will be 180 trials in total. The experiment will track:</p>
        <ul className="list-disc list-inside mb-4">
          <li className="mb-2">How quickly you reach the target</li>
          <li className="mb-2">How far your cursor travels</li>
          <li className="mb-2">Any errors (clicks outside the target)</li>
        </ul>
        <p className="mb-4">Your participant ID is: <span className="font-bold">{participantId}</span></p>
      </div>
      
      <div className="flex gap-4">
        <button 
          onClick={startExperiment} 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Begin Experiment
        </button>
        <button 
          onClick={() => setScreen("welcome")} 
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );

  // Render the experiment screen
  const renderExperimentScreen = () => {
    const currentTrial = trials[currentTrialIndex] || { size: 0, distance: 0, direction: 'left' };
    const targetSize = currentTrial.size;
    const distance = currentTrial.distance;
    const direction = currentTrial.direction;
    
    // Calculate target position
    const centerX = window.innerWidth / 2;
    const targetX = direction === 'right' 
      ? centerX + distance 
      : centerX - distance;
    
    return (
      <div 
        className="flex flex-col items-center justify-center h-screen w-full"
        onMouseMove={handleMouseMove}
        onClick={handleBackgroundClick}
      >
        <div className="absolute top-4 left-4 text-sm">
          <p>Participant ID: {participantId}</p>
          <p>Trial: {currentTrialIndex + 1} / {trials.length}</p>
        </div>
        
        <button 
          onClick={terminateExperiment}
          className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700"
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
            Start Trial
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
  };

  // Render the results screen
  const renderResultsScreen = () => (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Experiment Complete!</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <p className="mb-4">Thank you for participating in this experiment.</p>
        <p className="mb-4">Your data has been saved and downloaded as a CSV file.</p>
        <p className="mb-4">Participant ID: <span className="font-bold">{participantId}</span></p>
        <p className="mb-4">Number of trials completed: <span className="font-bold">{experimentData.length}</span></p>
      </div>
      
      <button 
        onClick={() => setScreen("welcome")} 
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Start New Experiment
      </button>
    </div>
  );

  // Render the appropriate screen based on current state
  return (
    <div className="h-screen w-full">
      {screen === "welcome" && renderWelcomeScreen()}
      {screen === "instructions" && renderInstructionsScreen()}
      {screen === "experiment" && renderExperimentScreen()}
      {screen === "results" && renderResultsScreen()}
    </div>
  );
}