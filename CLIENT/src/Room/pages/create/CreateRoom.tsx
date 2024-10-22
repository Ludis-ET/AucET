import { useState } from "react";
import { Step1 } from "./Step1";
import toast from "react-hot-toast";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";
import { Timestamp } from "firebase/firestore";

export interface SteProps {
  form: (string | Timestamp)[];
  click: (i: number, value: string | Timestamp) => void;
}

export const CreateRoom = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<{ [key: number]: (string | Timestamp)[] }>({
    1: ["", "", ""],
    2: ["", ""],
    3: ["ludis"],
    4: [],
  });

  const nextStep = (count: number) => {
    if (countFilledFields(count)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fill in all the fields for the current step.");
    }
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const click = (step: number, index: number, value: string | Timestamp) => {
    const newStepForm = [...form[step]];
    newStepForm[index] = value;
    setForm((prevForm) => ({ ...prevForm, [step]: newStepForm }));
  };

  const countFilledFields = (requiredCount: number) => {
    const filledFields = form[currentStep].filter(
      (field) => field !== ""
    ).length;
    return filledFields === requiredCount;
  };

 const renderStep = () => {
   switch (currentStep) {
     case 1:
       return <Step1 form={form[1]} click={(i, value) => click(1, i, value)} />;
     case 2:
       return <Step2 form={form[2]} click={(i, value) => click(2, i, value)} />;
     case 3:
       return <Step3 form={form[3]} click={(i, value) => click(3, i, value)} />; 
     default:
       return <div>end</div>;
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
            onClick={() => {
              if (countFilledFields(form[1].length)) {
                setCurrentStep(1);
              } else {
                toast.error(
                  "Please fill in all the fields for the current step."
                );
              }
            }}
          >
            General Info
          </button>

          <button
            className={`p-3 font-semibold rounded-lg transition-colors ${
              currentStep === 2
                ? "bg-buttonBackground text-white"
                : "bg-gray-200 text-otherText"
            }`}
            onClick={() => {
              if (countFilledFields(form[1].length)) {
                setCurrentStep(2);
              } else {
                toast.error("Please fill in all the fields for User Info.");
              }
            }}
          >
            Time
          </button>

          <button
            className={`p-3 font-semibold rounded-lg transition-colors ${
              currentStep === 3
                ? "bg-buttonBackground text-white"
                : "bg-gray-200 text-otherText"
            }`}
            onClick={() => {
              if (countFilledFields(form[1].length)) {
                setCurrentStep(3);
              } else {
                toast.error("Please fill in all the fields for Time Info.");
              }
            }}
          >
            Description
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
            {currentStep < 5 && (
              <button
                onClick={() => nextStep(form[currentStep].length)}
                className="px-6 py-3 font-semibold bg-buttonBackground text-white rounded-lg shadow hover:bg-buttonHover transition-colors"
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
