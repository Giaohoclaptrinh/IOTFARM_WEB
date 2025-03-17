//import React from "react";
import { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
//import { Zoom } from "@mui/material";
import CustomDay from "./customday";
// import { Datepicker } from "flowbite";

const Chart = () => {
  const [isOpenFilterDay, setIsOpenFilterDay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chartRef = useRef(null);

  // const handleOpenFilterDay = () => {
  //   setIsOpenFilterDay(true);
  // };
  // const handleCloseFilterDay = () => {
  //   setIsOpenFilterDay(false);
  // };
  const generateFakeData = (days, pointsPerDay, min, max) => {
    return Array.from({ length: days * pointsPerDay }, () =>
      (Math.random() * (max - min) + min).toFixed(2) // Sinh số float từ min đến max
    );
  };

  const formatTime = (index, pointsPerDay) => {
    const totalMinutesInDay = 24 * 60; // 1440 phút trong 1 ngày
    const minutesPerPoint = totalMinutesInDay / pointsPerDay; // Khoảng cách giữa các điểm (phút)

    const totalMinutes = Math.floor(index * minutesPerPoint); // Tổng số phút từ đầu ngày
    const hours = Math.floor(totalMinutes / 60); // Giờ
    const minutes = totalMinutes % 60; // Phút

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };


  const days = 3; // 10 ngày
  const pointsPerDay = 10; // 14400 điểm mỗi ngày

  const dates = Array.from({ length: days * pointsPerDay }, (_, i) => {
    const day = Math.floor(i / pointsPerDay) + 1; // Ngày hiện tại
    const time = formatTime(i % pointsPerDay, pointsPerDay); // Tính giờ, phút, giây
    return `${time}`;
  });

  const initChart = async () => {
    const options = {
      chart: {
        // with: "100%",
        height: "200%",
        // minHeight: "500px",
        // maxHeight: "1000px",
        minWidth: "100%",
        type: "line",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        zoom: {
          enabled: true,
          type: "x", // Zoom horizontally
          autoScaleYaxis: true,
        },
        pan: {
          enabled: true,
          mode: "x", // Allow panning in X direction
          touch: true,
        },
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      // grid: {
      //   show: true,
      //   strokeDashArray: 4,
      //   padding: {
      //     left: 2,
      //     right: 2,
      //     top: -26
      //   },
      // },
      series: [
        {
          name: "Clicks",
          data: generateFakeData(days, pointsPerDay, 3.0, 5.0),
          color: "#1A56DB",
        },
        //   {
        //     name: "CPC",
        //     data: generateFakeData(50, 6000, 7000),
        //     color: "#7E3AF2",
        //   },
      ],
      legend: {
        show: false,
      },
      xaxis: {
        categories: dates,
        tickAmount: 3, // Giúp trải nghiệm zoom mượt hơn
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
          },
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        show: false,
      },
    };
    const chart = new ApexCharts(chartRef.current, options);
    chart.render();
  };

  useEffect(() => {
    initChart();
  }, []);
  return (
    <div className="relative">
      <div className=" w-full rounded-lg shadow-sm bg-gray-800 p-4 md:p-6 relative">
        <div className="flex justify-between mb-5">
          <div className="grid gap-4 grid-cols-2">
            <div>
              <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                pH
                <svg
                  data-popover-target="clicks-info"
                  data-popover-placement="bottom"
                  className="w-3 h-3 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <div
                  data-popover=""
                  id="clicks-info"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                >
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Clicks growth - Incremental
                    </h3>
                    <p>
                      Report helps navigate cumulative growth of community
                      activities. Ideally, the chart should have a growing
                      trend, as stagnating chart signifies a significant
                      decrease of community activity.
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Calculation
                    </h3>
                    <p>
                      For each date bucket, the all-time volume of activities is
                      calculated. This means that activities in period n contain
                      all activities up to period n, plus the activities
                      generated by your community in period.
                    </p>
                    <a
                      href="#"
                      className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Read more{" "}
                      <svg
                        className="w-2 h-2 ms-1.5 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </a>
                  </div>
                  <div data-popper-arrow="" />
                </div>
              </h5>
              <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
                6.71
              </p>
            </div>
            {/* <div>
              <h5 className="inline-flex items-center text-gray-500 dark:text-gray-400 leading-none font-normal mb-2">
                CPC
                <svg
                  data-popover-target="cpc-info"
                  data-popover-placement="bottom"
                  className="w-3 h-3 text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ms-1"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <div
                  data-popover=""
                  id="cpc-info"
                  role="tooltip"
                  className="absolute z-10 invisible inline-block text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 w-72 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                >
                  <div className="p-3 space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      CPC growth - Incremental
                    </h3>
                    <p>
                      Report helps navigate cumulative growth of community
                      activities. Ideally, the chart should have a growing
                      trend, as stagnating chart signifies a significant
                      decrease of community activity.
                    </p>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Calculation
                    </h3>
                    <p>
                      For each date bucket, the all-time volume of activities is
                      calculated. This means that activities in period n contain
                      all activities up to period n, plus the activities
                      generated by your community in period.
                    </p>
                    <a
                      href="#"
                      className="flex items-center font-medium text-blue-600 dark:text-blue-500 dark:hover:text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Read more{" "}
                      <svg
                        className="w-2 h-2 ms-1.5 rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m1 9 4-4-4-4"
                        />
                      </svg>
                    </a>
                  </div>
                  <div data-popper-arrow="" />
                </div>
              </h5>
              <p className="text-gray-900 dark:text-white text-2xl leading-none font-bold">
                $5.40
              </p>
            </div> */}
          </div>
          <div>
            <button
              onClick={() => setIsOpenFilterDay((state) => !state)}
              type="button"
              className="px-3 py-2 inline-flex items-center text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Last week{" "}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="lastDaysdropdown"
              className={`z-50 ${isOpenFilterDay ? "" : "hidden"
                }  bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 absolute right-0 mt-2`}
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Yesterday
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Today
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 7 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 30 days
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Last 90 days
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Custom day
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div id="line-chart" ref={chartRef} />
      </div>
      {/* <div className="absolute ">handleLogin</div> */}
      {/* <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div>
      <div>handleLogin</div> */}
      <CustomDay isOpen={isOpen} setClose={setIsOpen}></CustomDay>
    </div>
  );
};
export default Chart;
