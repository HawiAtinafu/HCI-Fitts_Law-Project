import React from 'react';

export default function ResultsScreen({ participantId, experimentData, onStartNew }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Experiment Complete!</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6 w-full">
        <p className="mb-4">Thank you for participating in this experiment.</p>
        <p className="mb-4">Your data has been saved and downloaded as a CSV file.</p>
        <p className="mb-4">Participant ID: <span className="font-bold">{participantId}</span></p>
        <p className="mb-4">Number of trials completed: <span className="font-bold">{experimentData.length}</span></p>
      </div>
      
      <button 
        onClick={onStartNew} 
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Start New Experiment
      </button>
    </div>
  );
}