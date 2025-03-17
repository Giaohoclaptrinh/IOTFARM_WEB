import React from "react";
import { useState, useEffect, useRef } from "react";


function Table({ columns, data, onAdd, onEdit, onDelete, actions }) {
    const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const dropdownRefs = useRef([]);  // Mảng tham chiếu cho các dropdowns
  const buttonRefs = useRef([]);    // Mảng tham chiếu cho các buttons

  const toggleDropdown = (rowIndex) => {
    setOpenDropdownRow((prev) => (prev === rowIndex ? null : rowIndex));
  };

  // Kiểm tra click bên ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click ngoài cả button và dropdown
      if (
        dropdownRefs.current[openDropdownRow] && 
        !dropdownRefs.current[openDropdownRow].contains(event.target) && 
        !buttonRefs.current[openDropdownRow].contains(event.target)
      ) {
        setOpenDropdownRow(null); // Đóng dropdown khi click ngoài
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownRow]);
    return (
        <>
        <section className="bg-gray-50 dark:bg-gray-900 antialiased rounded-lg overflow-hidden">
            <div className="mx-auto max-w-screen-xl">
            {/* Header với Search và Actions */}
            <div className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4 p-4">
                {/* Search */}
                <div className="w-full sm:w-1/2">
                    <form className="flex items-center">
                    <label htmlFor="simple-search" className="sr-only">
                        Search
                    </label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        {/* Icon tìm kiếm */}
                        <svg
                            aria-hidden="true"
                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                            />
                        </svg>
                        </div>
                        <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Search"
                        required=""
                        />
                    </div>
                    </form>
                </div>
                {/* Actions */}
                <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 items-stretch sm:items-center justify-end sm:space-x-3 flex-shrink-0">
                    {onAdd && (
                    <button
                        type="button"
                        onClick={onAdd}
                        className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                    >
                        {/* Icon thêm */}
                        <svg
                        className="h-3.5 w-3.5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        >
                        <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        />
                        </svg>
                        Add
                    </button>
                    )}
                    {actions && (
                    <div className="flex items-center space-x-3 w-full md:w-auto ">
                        <button
                        id="actionsDropdownButton"
                        className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        type="button"
                        >
                        {/* Icon dropdown */}
                        <svg
                            className="-ml-1 mr-1.5 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            />
                        </svg>
                        Actions
                        </button>
                        {/* Dropdown Actions */}
                        <div
                        id="actionsDropdown"
                        className="hidden absolute z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        >
                        <ul
                            className="py-1 text-sm text-gray-700 dark:text-gray-200"
                            aria-labelledby="actionsDropdownButton"
                        >
                            <li>
                            <button
                                onClick={onEdit}
                                className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Edit
                            </button>
                            </li>
                            <li>
                            <button
                                onClick={onDelete}
                                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                            >
                                Delete
                            </button>
                            </li>
                        </ul>
                        </div>
                    </div>
                    )}
                </div>
                </div>
                {/* Bảng dữ liệu */}
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        {columns.map((column) => (
                        <th key={column.key} scope="col" className="px-4 py-4">
                            {column.header}
                        </th>
                        ))}
                        <th scope="col" className="px-4 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                        key={rowIndex}
                        className="border-b dark:border-gray-700"
                        >
                        {columns.map((column) => (
                            <td key={column.key} className="px-4 py-3">
                            {column.render
                                ? column.render(row[column.key], row)
                                : row[column.key]}
                            </td>
                        ))}
                        
                            <td className="px-4 py-3 flex items-center justify-end">
                            <button
                                ref={(el) => (buttonRefs.current[rowIndex] = el)}
                                onClick={() => toggleDropdown(rowIndex)}
                                className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button"
                            >
                                <svg
                                className="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                >
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                            <div
                                ref={(el) => (dropdownRefs.current[rowIndex] = el)}
                                id={`dropdown-${rowIndex}`}
                                className={`absolute z-10 w-44 right-20 bg-white rounded divide-y divide-gray-100 shadow shadow-gray-900 dark:bg-gray-700 dark:divide-gray-600 ${openDropdownRow === rowIndex ? 'block' : 'hidden'}`}
                            >
                                <ul
                                className="py-1 text-sm"
                                aria-labelledby={`dropdown-button-${rowIndex}`}
                                >
                                <li>
                                    <button
                                    onClick={() => {
                                        onEdit(row); 
                                        toggleDropdown(rowIndex); 
                                      }}
                                    type="button"
                                    data-modal-target="updateProductModal"
                                    data-modal-toggle="updateProductModal"
                                    className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                                    >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                        />
                                    </svg>
                                    Edit
                                    </button>
                                </li>
                                <li>
                                    <button
                                    onClick={() => {
                                        onDelete(row),
                                        toggleDropdown(rowIndex)
                                    }}
                                    type="button"
                                    data-modal-target="deleteModal"
                                    data-modal-toggle="deleteModal"
                                    className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400"
                                    >
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        viewBox="0 0 14 15"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        fill="currentColor"
                                        d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z"
                                        />
                                    </svg>
                                    Delete
                                    </button>
                                </li>
                                </ul>
                            </div>
                            </td>
                        
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            </div>
        </section>
        </>
    );
}

export default Table;
