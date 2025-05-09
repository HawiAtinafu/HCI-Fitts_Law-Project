import React from 'react';

export default function WelcomeScreen({ onConsent, onDecline }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4 md:p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center">INFORMED CONSENT DOCUMENT</h1>
        </div>

        <div className="p-6 md:p-8 text-gray-900 text-xl md:text-lg leading-relaxed">
          <p className="text-center mb-6">
            Please read the following informed consent document. If you consent to the study, click "I Agree" at the bottom. 
            If you do not consent and would like to cancel your participation in the study, click "I Decline".
          </p>

          <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-8 overflow-y-auto max-h-[600px] border border-gray-200 text-gray-900">
            <h2 className="text-2xl font-semibold mb-4 text-center">CS470 HCI – Fitts' Law study</h2>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Research Team:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Bethel Zegeye (bethel.zegeye@mnsu.edu)</li>
                <li>Hawi Atinafu (hawi.atinafu@mnsu.edu)</li>
                <li>Nahom Woinu (nahom.woinu @mnsu.edu)</li>
                <li>Sonia Sherif (sonia.sherif@mnsu.edu)</li>
              </ul>
            </div>

            <p className="mb-4">
              Thank you for agreeing to participate in this research study! This document provides important information about what 
              you will be asked to do during the research study, about the risks and benefits of the study, and about your rights 
              as a research subject. If you have any questions about or do not understand something in this document, you should 
              ask questions to the members of the research team listed above.
            </p>

            <p className="mb-4">
              The purpose of this research study is to evaluate how accurately a user can click on differently-sized targets on screen. 
              During the study, you will be randomly presented with targets of different sizes and at different distances. 
              There will be a total of 180 trials, and each trial will take anywhere from 1 to 5 seconds, depending on your speed.
              The entire study should take no longer than 15–20 minutes to complete.
            </p>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">To participate in this study, you must:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Be at least 18 years of age</li>
                <li>Be able to use a mouse or trackpad without assistive devices</li>
              </ul>
            </div>

            <p className="mb-4">
              To collect data, our software will record how much you move the mouse, how long it takes you to successfully 
              complete each trial, and whether you make any errors. This information will be recorded anonymously, and no 
              personally identifiable information will be collected.
            </p>

            <p className="mb-4">
              You will not be compensated for your participation in this study. We do not believe there are any direct benefits 
              to you based on your participation in the study. We do not anticipate any significant risks in your participating 
              in this study.
            </p>

            <p className="mb-4">
              You may end your participation in the study at any time. If you wish to end your participation, please use the 
              "Terminate Experiment" button. If you decide to end your participation early, any results collected by the software 
              for your session will not be saved.
            </p>

            <p className="mb-4 font-medium">
              By clicking "I Agree" below, you hereby acknowledge that you are at least 18 years of age, and that you are able to use 
              a mouse or trackpad without assistive devices. You also indicate that you agree to the following statement:
            </p>

            <p className="italic border-l-4 border-blue-600 pl-4 py-2 mb-4 bg-white">
              "I have read this consent form and I understand the risks, benefits, and procedures involved with participation 
              in this research study. I hereby agree to participate in this research study."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onConsent} 
              className="bg-blue-600 text-white px-6 py-3 rounded font-medium hover:bg-blue-700 transition-colors text-lg"
            >
              I Agree
            </button>
            <button 
              onClick={onDecline} 
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded font-medium hover:bg-gray-400 transition-colors text-lg"
            >
              I Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
