import { useRef, useEffect, useState } from "react";
import "flowbite/dist/flowbite.min.js";  // Đảm bảo bạn đã import Flowbite JS
import "flowbite/dist/flowbite.min.css";  // Đảm bảo bạn đã import Flowbite JS


const DateRangePicker = () => {
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDateRef.current && !startDateRef.current.datepicker) {
      startDateRef.current.datepicker = new window.Datepicker(startDateRef.current, {
        autohide: true,
        buttons: true,
        autoSelectToday: true,
        format: "yyyy-mm-dd",
        onHide: (date) => {
          setStartDate(date);
          console.log("Start date:", date);
        },
      });
    }

    if (endDateRef.current && !endDateRef.current.datepicker) {
      endDateRef.current.datepicker = new window.Datepicker(endDateRef.current, {
        autohide: true,
        buttons: true,
        autoSelectToday: true,
        format: "yyyy-mm-dd",
        onHide: (date) => {
          setEndDate(date);
          console.log("End date:", date);
        },
      });
    }

    return () => {
      startDateRef.current?.datepicker?.destroy();
      endDateRef.current?.datepicker?.destroy();
    };
  }, []);

  return (
    <div id="dateRangeDropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-80 lg:w-96 dark:bg-gray-700 dark:divide-gray-600">
      <div className="p-3" aria-labelledby="dateRangeButton">
        <div date-rangepicker="true" datepicker-autohide="true" className="flex items-center">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              name="start"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Start date"
              ref={startDateRef}
              data-datepicker="true"
            />
          </div>
          <span className="mx-2 text-gray-500 dark:text-gray-400">to</span>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              name="end"
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="End date"
              ref={endDateRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;