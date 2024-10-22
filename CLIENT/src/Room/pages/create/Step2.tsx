import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SteProps } from "./CreateRoom";
import { Timestamp } from "firebase/firestore";

export const Step2 = ({ click }: SteProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      const firestoreTimestamp = Timestamp.fromDate(date);
      click(0, firestoreTimestamp);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          1. Please select the starting date and time of the auction:
        </h3>
        <div className="md:ml-8">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="border-2 border-buttonBackground rounded-lg p-2 outline-none"
            placeholderText="Select a date and time"
            timeIntervals={60}
          />
        </div>
      </div>
    </div>
  );
};
