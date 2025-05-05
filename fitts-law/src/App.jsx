import { useState, useEffect } from "react";
import WelcomeScreen from "./WelcomeScreen";
import InstructionsScreen from "./InstructionsScreen";
import ExperimentScreen from "./ExperimentScreen";
import ResultsScreen from "./ResultsScreen";
import DeclinedScreen from "./DeclinedScreen";

// Main App Component
export default function FittsLawApp() {
  // Application States
  const [screen, setScreen] = useState("welcome"); // welcome, instructions, experiment, results, declined
  const [participantId, setParticipantId] = useState("");
  const [trials, setTrials] = useState([]);
  const [currentTrialIndex, setCurrentTrialIndex] = useState(0);
  const [experimentData, setExperimentData] = useState([]);
  
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
  
  // Handle consent decline
  const handleDecline = () => {
    setScreen("declined");
  };

  // Start the experiment
  const startExperiment = () => {
    const generatedTrials = generateTrials();
    setTrials(generatedTrials);
    setExperimentData([]);
    setCurrentTrialIndex(0);
    setScreen("experiment");
  };
  
  // Handle trial completion
  const handleTrialComplete = (trialData) => {
    // Add the new trial data to our collection
    const updatedData = [...experimentData, trialData];
    setExperimentData(updatedData);
    
    // Move to next trial or end experiment
    if (currentTrialIndex < trials.length - 1) {
      setCurrentTrialIndex(currentTrialIndex + 1);
    } else {
      downloadCSV(updatedData);
      setScreen("results");
    }
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

  // Render the appropriate screen based on current state
  return (
    <div className="h-screen w-full">
      {screen === "welcome" && (
        <WelcomeScreen onConsent={handleConsent} onDecline={handleDecline} />
      )}
      
      {screen === "instructions" && (
        <InstructionsScreen 
          participantId={participantId} 
          onStartExperiment={startExperiment} 
          onBack={() => setScreen("welcome")} 
        />
      )}
      
      {screen === "experiment" && (
        <ExperimentScreen 
          participantId={participantId}
          trials={trials}
          currentTrialIndex={currentTrialIndex}
          experimentData={experimentData}
          onTerminate={terminateExperiment}
          onTrialComplete={handleTrialComplete}
        />
      )}
      
      {screen === "results" && (
        <ResultsScreen 
          participantId={participantId}
          experimentData={experimentData}
          onStartNew={() => setScreen("welcome")} 
        />
      )}
      
      {screen === "declined" && (
        <DeclinedScreen onReturnHome={() => setScreen("welcome")} />
      )}
    </div>
  );
}