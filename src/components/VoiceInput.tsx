import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startVoiceInput = () => {
    console.log("Voice button clicked");
    
    // 1. USE CORRECT SPEECH RECOGNITION SETUP
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // If not available: Show alert
      alert("Voice input is not supported on this device. Please use Chrome.");
      return;
    }

    // 2. CREATE PROPER VOICE FUNCTION
    // Initialize recognition
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Voice recognition started");
      setIsListening(true);
      setError(null);
    };

    // 3. HANDLE RESULT EVENT
    recognition.onresult = function(event: any) {
      const transcript = event.results[0][0].transcript;
      console.log("Voice Input Received:", transcript);

      // Put text into input field as requested
      const inputField = document.getElementById("patientDetails") as HTMLInputElement | HTMLTextAreaElement;
      if (inputField) {
        inputField.value = transcript;
        // Trigger change event for React to update state
        const changeEvent = new Event('input', { bubbles: true });
        inputField.dispatchEvent(changeEvent);
      }

      // Also call the prop callback for AI processing (existing functionality)
      onTranscript(transcript);
    };

    // 4. HANDLE ERRORS (VERY IMPORTANT)
    recognition.onerror = function(event: any) {
      console.error("Voice error:", event.error);
      setError(event.error);

      if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please allow access.");
      }

      if (event.error === "no-speech") {
        alert("No speech detected. Please try again.");
      }
      setIsListening(false);
    };

    // 5. START & STOP PROPERLY
    recognition.onend = function() {
      console.log("Voice recognition ended");
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={startVoiceInput}
        disabled={isProcessing || isListening}
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300",
          isListening ? "bg-red-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700",
          (isProcessing || isListening) && "opacity-80 cursor-not-allowed"
        )}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        ) : isListening ? (
          <MicOff className="h-8 w-8 text-white" />
        ) : (
          <Mic className="h-8 w-8 text-white" />
        )}
      </button>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-600">
          {isListening ? "Listening..." : isProcessing ? "Processing AI..." : "Click to speak patient details"}
        </p>
        {error && (
          <p className="mt-2 max-w-xs text-xs font-medium text-red-500">
            {error === 'not-allowed' 
              ? "Microphone access denied. Please allow access."
              : `Error: ${error}`}
          </p>
        )}
      </div>
    </div>
  );
};
