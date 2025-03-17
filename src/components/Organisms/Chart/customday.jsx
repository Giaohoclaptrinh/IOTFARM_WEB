const CustomDay = ({ isOpen, setClose }) => {
  return (
    <div
      className={`${isOpen ? "block" : "hidden"} flex items-center justify-center absolute z-[10000] w-full h-full top-0 rounded-lg shadow-sm  bg-gray-300/90 p-4 md:p-6`}
    >
      <div
        id="dateRangeDropdown"
        className="z-50 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-90 lg:w-100 dark:bg-gray-700 dark:divide-gray-600"
      >
        <div className="p-3" aria-labelledby="dateRangeButton">
          <div
            className="flex items-center justify-center"
            data-rangepicker
            data-datepicker-autohide
          >
            <div className="relative">
              <input
                name="start"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Start date"
              />
            </div>
            <span className="mx-2 text-gray-500 dark:text-gray-400">to</span>
            <div className="relative">
              <input
                name="end"
                type="date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="End date"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setClose(false);
            }}
            className="bg-primary-900 text-white  rounded-lg mt-5 w-full h-10 text-center"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDay;
