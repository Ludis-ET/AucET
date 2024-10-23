import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SteProps } from "./CreateRoom";

export const Step2 = ({ form, click, current }: SteProps) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | "">("");

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      click(0, date.toString());
    }
  };

  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setDuration("");
      click(1, "");
    } else {
      const durationValue = parseInt(value);
      setDuration(durationValue);
      click(1, durationValue.toString());
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
            selected={startDate ? startDate : (current?.[0] instanceof Date ? current[0] : null)}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
            className="border-2 border-brown-500 rounded-lg p-2 outline-none"
            placeholderText="Select a date and time"
            timeIntervals={60}
            minDate={new Date(Date.now() + 86400000)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-medium">
          2. Please enter the duration of the auction (in hours):
        </h3>
        <input
          type="number"
          value={typeof current?.[1] === "string" || typeof current?.[1] === "number" ? current[1] : duration}
          onChange={handleDurationChange}
          className="border-2 border-brown-500 rounded-lg p-2 outline-none w-40 md:ml-8"
          placeholder="Duration in hours"
          min="1"
          required
        />
      </div>
      {form[2] === "set" && (
        <div className="flex flex-col gap-2">
          <h3 className="font-medium">3. Set the starting bid amount</h3>
          <input
            type="number"
            onChange={(e) => click(2, e.target.value)}
            value={
              typeof current?.[2] === "string" || typeof current?.[2] === "number"
                ? current?.[2] ?? ""
                : duration
            }
            className="border-2 border-brown-500 rounded-lg p-2 outline-none w-40 md:ml-8"
            placeholder="In terms of Bid."
            min="0.01"
            step="0.01"
            required
          />
        </div>
      )}
    </div>
  );
};
