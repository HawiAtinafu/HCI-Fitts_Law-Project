import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

/* ===============================================================
   CONSTANTS – tweak experiment design here
   ============================================================= */
const DISTANCES  = [160, 320, 480];   // px (A)
const WIDTHS     = [16, 32, 64];      // px (W)
const DIRECTIONS = [-1, 1];           // -1 left, +1 right
const REPS       = 10;                // each config ×10 → 180 trials

/*  UI STEPS  ──────────────────────────────────────────────────
    "welcome"   intro screen
    "consent"   informed‑consent text
    "ready"     centred "Yaay! click to continue" (cursor reset)
    "trial"     purple square target active
    "end"       thank‑you / CSV download
*/

export default function FittsLawApp() {
  /* -------------------- STATE ------------------- */
  const [step,          setStep]          = useState("welcome");
  const [participantId, setParticipantId] = useState(null);
  const [trials,        setTrials]        = useState([]);
  const [trialIndex,    setTrialIndex]    = useState(0);
  const [currentTrial,  setCurrentTrial]  = useState(null);
  const [trialData,     setTrialData]     = useState([]);
  const [errors,        setErrors]        = useState(0);
  const [path,          setPath]          = useState(0);

  /* --------------------- REFS ------------------- */
  const startTimeRef = useRef(0);
  const containerRef = useRef(null);          // root div – bg colour swap

  /* ------------------ HELPERS ------------------- */
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildTrials = () => {
    const buf = [];
    DISTANCES.forEach((A) =>
      WIDTHS.forEach((W) =>
        DIRECTIONS.forEach((dir) => {
          for (let r = 0; r < REPS; r++) buf.push({ A, W, dir });
        })
      )
    );
    return shuffle(buf);
  };

  /* ---------------- FLOW CONTROL --------------- */
  const initExperiment = () => {
    setParticipantId(uuidv4());
    setTrials(buildTrials());
    setTrialIndex(0);
    setTrialData([]);
    setStep("ready");                 // first ready screen
    flashGreen();
  };

  const beginTrial = () => {
    if (containerRef.current) containerRef.current.style.backgroundColor = "#f3f4f6"; // reset to gray‑100

    const trial = trials[trialIndex];
    setCurrentTrial(trial);
    setErrors(0);
    setPath(0);
    startTimeRef.current = performance.now();
    setStep("trial");
  };

  const completeTrial = (MT) => {
    setTrialData((d) => [
      ...d,
      { id: participantId, index: trialIndex, ...currentTrial, MT, path: Math.round(path), errors },
    ]);

    if (trialIndex + 1 >= trials.length) {
      setStep("end");
      return;
    }
    setTrialIndex((i) => i + 1);
    setStep("ready");
    flashGreen();
  };

  /* ------------- POINTER & CLICK -------------- */
  const handleMouseMove = (e) => {
    const { movementX, movementY } = e;
    setPath((p) => p + Math.hypot(movementX, movementY));
  };

  const handleClick = (e) => {
    if (!currentTrial) return;
    if (e.target.dataset.target === "true") {
      const MT = Math.round(performance.now() - startTimeRef.current);
      completeTrial(MT);
    } else {
      setErrors((err) => err + 1);
    }
  };

  /* --------------- VISUAL FEEDBACK ------------- */
  const flashGreen = () => {
    if (containerRef.current) containerRef.current.style.backgroundColor = "#bbf7d0"; // green‑200
  };

  /* -------------------- ABORT ------------------ */
  const abort = () => {
    if (window.confirm("Abort experiment and discard data?")) {
      setTrialData([]);
      setStep("welcome");
      if (containerRef.current) containerRef.current.style.backgroundColor = "#f3f4f6";
    }
  };

  /* -------------------- RENDER ----------------- */
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const targetStyle = currentTrial && step === "trial" ? {
    width: currentTrial.W,
    height: currentTrial.W,
    backgroundColor: "#7c3aed",
    position: "absolute",
    left: centerX + currentTrial.dir * currentTrial.A - currentTrial.W / 2,
    top:  centerY - currentTrial.W / 2,
    cursor: "crosshair",
  } : {};

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen select-none flex items-center justify-center bg-gray-100"
      onMouseMove={step === "trial" ? handleMouseMove : undefined}
      onClick={step === "trial" ? handleClick : undefined}
    >
      {/* -------- WELCOME -------- */}
      {step === "welcome" && (
        <Card title="Fitts' Law Study">
          <button onClick={() => setStep("consent")} className="btn-primary">Continue</button>
        </Card>
      )}

      {/* -------- CONSENT -------- */}
      {step === "consent" && (
        <ConsentScreen onAgree={initExperiment} onDecline={() => setStep("welcome")} />
      )}

      {/* -------- READY (cursor‑reset) -------- */}
      {step === "ready" && (
        <div
          onClick={beginTrial}
          className="cursor-pointer text-xl font-semibold text-purple-900 select-none"
        >
          Yaay! click to continue<br/>
          ({trialIndex + 1}/{trials.length})
        </div>
      )}

      {/* -------- TRIAL -------- */}
      {step === "trial" && (
        <>
          <div style={targetStyle} data-target="true" />
          <AbortLink onAbort={abort} />
        </>
      )}

      {/* -------- END -------- */}
      {step === "end" && <EndScreen data={trialData} participantId={participantId} />}
    </div>
  );
}

/* =============================================================
   SMALL HELPER COMPONENTS
   =========================================================== */
const Card = ({ title, children }) => (
  <div className="text-center space-y-8 p-8 max-w-md bg-white shadow-lg rounded-2xl">
    <h1 className="text-2xl font-bold">{title}</h1>
    {children}
  </div>
);

const AbortLink = ({ onAbort }) => (
  <button onClick={onAbort} className="absolute top-4 right-4 text-sm text-red-600 underline">Abort</button>
);

function ConsentScreen({ onAgree, onDecline }) {
  return (
    <div className="bg-white p-6 shadow-xl rounded-xl max-w-xl space-y-4 overflow-y-auto h-[80vh]">
      <h2 className="text-xl font-semibold mb-2">Informed Consent</h2>
      <p className="text-sm leading-relaxed">(Insert updated consent text here…)</p>
      <div className="flex justify-end gap-4 pt-4">
        <button onClick={onDecline} className="btn-gray">Decline</button>
        <button onClick={onAgree}   className="btn-primary">I Agree</button>
      </div>
    </div>
  );
}

function EndScreen({ data, participantId }) {
  const csvHeader = ["participant_id","trial","A","W","dir","MT_ms","path_px","errors"];
  const csvRows   = data.map((d) => [d.id,d.index,d.A,d.W,d.dir,d.MT,d.path,d.errors].join(","));
  const csv       = [csvHeader.join(","), ...csvRows].join("\n");

  useEffect(() => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `${participantId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <Card title="All Done!">
      <p>Thank you for participating.</p>
      <p className="text-sm text-gray-500">Your data has been saved.</p>
    </Card>
  );
}

/* =============================================================
   OPTIONAL TAILWIND SHORTCUTS
   =========================================================== */
// .btn-primary { @apply px-6 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700; }
// .btn-gray    { @apply px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300; }
