import React from 'react';

export default function DeclineScreen({ onReturnHome }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-lg w-full">
        <div className="bg-gray-100 p-6 border-b">
          <h1 className="text-2xl font-bold text-center">Participation Declined</h1>
        </div>
        
        <div className="p-6">
          <p className="mb-6 text-center">
            Thank you for your interest in our study. You have chosen to decline participation, and no data has been collected.
          </p>
          
          <p className="mb-6 text-center">
            If you changed your mind or clicked this button by mistake, you can return to the consent page.
          </p>
          
          <div className="flex justify-center">
            <button
              onClick={onReturnHome}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}