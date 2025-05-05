import React from 'react';

export default function InstructionsScreen({ participantId, onStartExperiment, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Instructions</h1>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6 w-full">
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
          onClick={onStartExperiment} 
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Begin Experiment
        </button>
        <button 
          onClick={onBack} 
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
  );
}