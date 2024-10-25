import { useCallback, useEffect, useRef, useState } from "react";

interface CountDownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountDown = ({ time }: { time: string }) => {
  const [countDownTime, setCountDownTime] = useState<CountDownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const secondTimer = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getTimeDifference = (countDownDate: number) => {
    const currentTime = new Date().getTime();
    const timeDifference = countDownDate - currentTime;

    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (60 * 60 * 1000)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

    if (timeDifference < 0) {
      if (secondTimer.current) {
        secondTimer.current.className = "relative top-5";
      }
      setCountDownTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      if (secondTimer.current) {
        secondTimer.current.className = "animate-timer";
      }
      setCountDownTime({ days, hours, minutes, seconds });
    }
  };

  const startCountDown = useCallback(() => {
    const countDownDate = new Date(time).getTime();

    timerRef.current = setInterval(() => {
      getTimeDifference(countDownDate);
    }, 1000);
  }, [time]);

  useEffect(() => {
    startCountDown();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startCountDown]);

  return (
    <div className="flex gap-3 sm:gap-1 justify-center flex-row bg-transparent h-36 rounded-lg overflow-hidden pt-2 pr-3 sm:pt-0 sm:pr-0">
      <div className="flex flex-col bg-buttonBackground sm:w-32 w-16">
        <div className="h-16 sm:h-20 bg-buttonBackground">
          <div className="h-[60px] flex justify-center bg-buttonBackground sm:text-3xl text-xl !text-white">
            <div
              className={
                countDownTime.days >= 0 &&
                countDownTime.hours === 23 &&
                countDownTime.minutes === 59 &&
                countDownTime.seconds === 59
                  ? "animate-timer"
                  : "relative top-5"
              }
            >
              {countDownTime.days}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-lg sm:text-2xl text-center text-white">
            {countDownTime.days === 1 ? "Day" : "Days"}
          </span>
        </div>
      </div>
      <div className="flex flex-col bg-buttonBackground sm:w-32 w-16">
        <div className="h-16 sm:h-20 bg-buttonBackground">
          <div className="h-[60px] flex justify-center bg-buttonBackground sm:text-3xl text-xl !text-white">
            <div
              className={
                countDownTime.hours >= 0 &&
                countDownTime.minutes === 59 &&
                countDownTime.seconds === 59
                  ? "animate-timer"
                  : "relative top-5"
              }
            >
              {countDownTime.hours}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-lg sm:text-2xl text-center text-white">
            {countDownTime.hours === 1 ? "Hour" : "Hours"}
          </span>
        </div>
      </div>
      <div className="flex flex-col bg-buttonBackground sm:w-32 w-16">
        <div className="h-16 sm:h-20 bg-buttonBackground">
          <div className="h-[60px] flex justify-center bg-buttonBackground sm:text-3xl text-xl !text-white">
            <div
              className={
                countDownTime.minutes >= 0 && countDownTime.seconds === 59
                  ? "animate-timer"
                  : "relative top-5"
              }
            >
              {countDownTime.minutes}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-lg sm:text-2xl text-center text-white">
            {countDownTime.minutes === 1 ? "Minute" : "Minutes"}
          </span>
        </div>
      </div>
      <div className="flex flex-col bg-buttonBackground sm:w-32 w-16">
        <div className="h-16 sm:h-20 bg-buttonBackground">
          <div className="h-[60px] flex justify-center bg-buttonBackground overflow-hidden sm:text-3xl text-xl text-white">
            <div ref={secondTimer}>{countDownTime.seconds}</div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-lg sm:text-2xl text-center text-white">
            {countDownTime.seconds === 1 ? "Second" : "Seconds"}
          </span>
        </div>
      </div>
    </div>
  );
};
