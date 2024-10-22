import { useState } from "react";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";

export const CreateRoom = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(["", ""]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const click = (i: number, value: string) => {
    const newForm = [...form];
    newForm[i] = value;
    setForm(newForm);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 form={form} click={click} />;
      case 2:
        return <Step2 />;
      default:
        return <Step1 form={form} click={click} />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-mainBackground rounded-lg shadow-lg">
      <div className="grid grid-cols-5 gap-8 h-[70vh]">
        <div className="col-span-full hidden md:flex md:col-span-1 flex-col space-y-4 bg-secondaryBackground p-4 rounded-lg shadow-md gap-2 py-12">
          <button
            className={`p-3 font-semibold rounded-lg transition-colors ${
              currentStep === 1
                ? "bg-buttonBackground text-white"
                : "bg-gray-200 text-otherText"
            }`}
            onClick={() => setCurrentStep(1)}
          >
            User Info
          </button>
          <button
            className={`p-3 font-semibold rounded-lg transition-colors ${
              currentStep === 2
                ? "bg-buttonBackground text-white"
                : "bg-gray-200 text-otherText"
            }`}
            onClick={() => setCurrentStep(2)}
          >
            Account Info
          </button>
          <button
            className={`p-3 font-semibold rounded-lg transition-colors ${
              currentStep === 3
                ? "bg-buttonBackground text-white"
                : "bg-gray-200 text-otherText"
            }`}
            onClick={() => setCurrentStep(3)}
          >
            Social Accounts
          </button>
        </div>

        <div className="col-span-full md:col-span-4 bg-secondaryBackground p-6 rounded-lg shadow-md">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-3 font-semibold bg-gray-300 rounded-lg shadow hover:bg-gray-400 transition-colors"
              >
                Previous
              </button>
            )}
            {currentStep < 3 && (
              <button
                onClick={nextStep}
                className="px-6 py-3 font-semibold bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
