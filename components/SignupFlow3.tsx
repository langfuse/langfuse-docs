import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export function SignupFlow3() {
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState("");
  const [signupReason, setSignupReason] = useState("");
  const [organizationType, setOrganizationType] = useState("");

  const [primaryUse, setPrimaryUse] = useState([]);
  const [hearAboutUs, setHearAboutUs] = useState("");

  const totalSteps = signupReason === "Invited by team" ? 4 : 5;
  const textInputRef = useRef(null);

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinish = () => {
    // Handle final submission
    console.log("Final submission:", { 
      role, 
      signupReason, 
      organizationType,
      primaryUse, 
      hearAboutUs 
    });
  };

  const handleSkip = () => {
    // Skip step 5 if "Invited by team" is selected
    if (currentStep === 4 && signupReason === "Invited by team") {
      // Skip to final submission
      console.log("Final submission:", { 
        role, 
        signupReason, 
        organizationType,
        primaryUse, 
        hearAboutUs 
      });
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Skipped final step");
    }
  };

  const handlePrimaryUseChange = (option) => {
    setPrimaryUse(prev => {
      if (option === "Don't know yet") {
        if (prev.includes(option)) {
          // Remove "Don't know yet" if already selected
          return prev.filter(item => item !== option);
        } else {
          // Select only "Don't know yet" and clear all others
          return [option];
        }
      } else {
        // For any other option, remove "Don't know yet" first
        let newSelection = prev.filter(item => item !== "Don't know yet");
        
        if (newSelection.includes(option)) {
          // Remove option if already selected
          return newSelection.filter(item => item !== option);
        } else {
          // Add option if not selected
          return [...newSelection, option];
        }
      }
    });
  };

  const handleSingleSelectChange = (setter, value) => {
    setter(value);
    // Auto-advance to next step after a short delay, unless "Invited by team" on step 4
    setTimeout(() => {
      if (currentStep === 4 && value === "Invited by team") {
        return; // Stay on step 4, only finish button will be shown
      }
      // Force advance if on step 4 and switching away from "Invited by team"
      if (currentStep === 4 && setter === setSignupReason && value !== "Invited by team") {
        setCurrentStep(5); // Force advance to step 5
        return;
      }
      // For all other cases, use normal handleContinue
      handleContinue();
    }, 200);
  };



  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepComplete = () => {
    switch (currentStep) {
      case 1:
        return role !== "";
      case 2:
        return organizationType !== "";
      case 3:
        return primaryUse.length > 0;
      case 4:
        return signupReason !== "";
      case 5:
        return true; // Last step (text input) is optional, always allow continue
      default:
        return false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent arrow key actions when user is typing in input field
      if (event.target.tagName === 'INPUT' && event.target.type === 'text') {
        return;
      }

      // Allow Enter for Next button on step 3 or for submission (finish)
      if (event.key === "Enter" && currentStep === 3 && isCurrentStepComplete()) {
        event.preventDefault();
        handleContinue();
      } else if (event.key === "Enter" && ((currentStep === 5) || (currentStep === 4 && signupReason === "Invited by team"))) {
        event.preventDefault();
        handleFinish();
      } else if (event.key === "ArrowLeft" && currentStep > 1) {
        event.preventDefault();
        handleBack();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSkip();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStep, role, signupReason, organizationType, primaryUse, hearAboutUs]);

  // Auto-focus text input when step 5 is reached (only if not skipped)
  useEffect(() => {
    if (currentStep === 5 && signupReason !== "Invited by team" && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [currentStep, signupReason]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/langfuse_logo.svg"
            alt="Langfuse Logo"
            width={140}
            height={30}
            className="block dark:hidden"
          />
          <Image
            src="/langfuse_logo_white.svg"
            alt="Langfuse Logo"
            width={140}
            height={30}
            className="hidden dark:block"
          />
        </div>


                {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col">
          <div className="flex-1 flex flex-col">
            {/* Progress Indicator */}
            <div className="flex space-x-2 mb-6">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i + 1 <= currentStep ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">What describes you best?</h2>
                  <div className="space-y-2">
                    {['Software Engineer', 'ML Engineer / Data Scientist', 'Product Manager', 'Domain Expert', 'Executive or Manager', 'Other'].map((option) => (
                      <label key={option} className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${role === option ? 'bg-gray-100' : ''}`}>
                        <input
                          type="radio"
                          name="role"
                          value={option}
                          checked={role === option}
                          onChange={(e) => handleSingleSelectChange(setRole, e.target.value)}
                          className="mr-3 text-gray-900"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">What describes your organization best?</h2>
                  <div className="space-y-2">
                    {[ 'Educational or Side Project', 'Start-Up (1-10 employees)', 'Small Enterprise (11-50 employees)', 'Medium Enterprise (51-250 employees)', 'Large Enterprise (250+ employees)'].map((option) => (
                      <label key={option} className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${organizationType === option ? 'bg-gray-100' : ''}`}>
                        <input
                          type="radio"
                          name="organizationType"
                          value={option}
                          checked={organizationType === option}
                          onChange={(e) => handleSingleSelectChange(setOrganizationType, e.target.value)}
                          className="mr-3 text-gray-900"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">What do you want to use Langfuse for?</h2>
                  <p className="text-xs text-gray-500 mb-4">Multiple options are allowed</p>
                  <div className="space-y-2">
                    {['Trace LLM input & output', 'Manage & Iterate Prompts', 'Evaluate LLM output', 'Optimize Cost & Latency', "Don't know yet"].map((option) => (
                      <label key={option} className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${primaryUse.includes(option) ? 'bg-gray-100' : ''}`}>
                        <input
                          type="checkbox"
                          value={option}
                          checked={primaryUse.includes(option)}
                          onChange={() => handlePrimaryUseChange(option)}
                          className="mr-3 text-gray-900"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Why do you sign-up?</h2>
                  <div className="space-y-2">
                    {['Invited by team', 'Just looking around', 'Evaluating / Testing Langfuse','Start using Langfuse', 'Migrating from other solution', 'Migrating from self-hosted'].map((option) => (
                      <label key={option} className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${signupReason === option ? 'bg-gray-100' : ''}`}>
                        <input
                          type="radio"
                          name="signupReason"
                          value={option}
                          checked={signupReason === option}
                          onChange={(e) => handleSingleSelectChange(setSignupReason, e.target.value)}
                          className="mr-3 text-gray-900"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">How did you hear about us?</h2>
                  <div className="p-1">
                    <input
                      ref={textInputRef}
                      type="text"
                      value={hearAboutUs}
                      onChange={(e) => setHearAboutUs(e.target.value)}
                      className="w-full h-10 px-4 text-sm border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>

            <div className="flex items-center justify-between pt-6 mt-auto">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {/* Show finish button when on step 5 or step 4 with "Invited by team" */}
              {(currentStep === 5 || (currentStep === 4 && signupReason === "Invited by team")) ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors cursor-pointer"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-6 h-8 font-medium rounded-sm transition-colors flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                  >
                    Finish
                    <span className="text-xs opacity-75">↵</span>
                  </button>
                </div>
              ) : currentStep === 3 ? (
                /* Step 3 (multi-select) needs a Next button */
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors cursor-pointer"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!isCurrentStepComplete()}
                    className={`px-6 h-8 font-medium rounded-sm transition-colors flex items-center gap-2 ${
                      isCurrentStepComplete()
                        ? 'bg-gray-900 hover:bg-gray-800 text-white cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    {isCurrentStepComplete() && (
                      <span className="text-xs opacity-75">↵</span>
                    )}
                  </button>
                </div>
              ) : (
                /* For other steps, just show skip button */
                <button
                  onClick={handleSkip}
                  className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors cursor-pointer"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-center text-sm text-gray-500">
          Helps us customize your account for you.
        </p>
      </div>
    </div>
  );
} 