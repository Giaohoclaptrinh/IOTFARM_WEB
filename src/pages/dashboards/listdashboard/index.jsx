import React, { useState, useEffect } from 'react';
import Table from '../../../components/Organisms/Table';
import Select from "react-select";
import { getDashboardsByUserId, addDashboard, deleteDashboard, getDevicesByUserId, getVariablesByUserId, updateDashboard } from '@/services/firebase/firestoreService';
import { useAuth } from "@/contexts/Auth";
import { Link } from 'react-router-dom';

// import { useAuth } from '../../../contexts/Auth';
// import { useLoaderData } from "react-router-dom";
function ListDashboards() {
    const [dashboards, setDashboards] = useState([]);
    const [devicesOptions, setDevicesOptions] = useState([]);
    const [selectedDevicesOptions, setSelectedDevicesOptions] = useState([])
    const [variablesOptions, setVariablesOptions] = useState([]);
    const [selectedVariablesOptions, setSelectedVariablesOptions] = useState([])
    const [variablesOptionsByDevices, setVariablesOptionsByDevices] = useState([]);  
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddDashboard, setIsAddDashboard] = useState(false);
    const { currentUser } = useAuth(); // Lấy user từ context

    const columns = [
        {
            header: 'Dashboard Name',
            key: 'name',
            render: (value, row) => <Link to={`/dashboards/${row.id}`}>{value}</Link>,
        },
        {
            header: 'Last modified',
            key: 'updateTime'
        },
        {
            header: 'Creation date',
            key: 'createTime'
        },

    ];

    const handleAdd = () => {
        setIsAddDashboard(!isAddDashboard);
    };

    const handleAddNewDashboard = async (event) => {
        event.preventDefault();
        const newDashboard = {
            name: event.target.dashboardName.value,
            userId: currentUser.uid,
            devices: [],     
            variables: []          
        };
        
        // const { id, createTime } = await addDashboard(newDashboard);
        const docRef = await addDashboard(newDashboard);
        console.log("Dashboard added with ID: ", docRef);
        const newDashboardWithId  = { ...newDashboard, id: docRef.id };
        setDashboards((prevDashboards) => [...prevDashboards, newDashboardWithId]);
        setIsAddDashboard(false);
        event.target.reset();
      };

    const handleEdit = async(row) => {
        setSelectedDashboard(row);
        setIsModalOpen(true);
        const devicesSnapshot = await getDevicesByUserId(currentUser.uid);
        const devicesList = devicesSnapshot.map(device => ({ value: device.id, label: device.name }));
        setDevicesOptions(devicesList);
        const variablesSnapshot = await getVariablesByUserId(currentUser.uid);
        const variablesList = variablesSnapshot.map(variable => ({ value: variable.id, label: variable.name, deviceId: variable.deviceId }));
        setVariablesOptions(variablesList);
        // console.log(variablesList);
        // console.log(variablesList);
    };

    const handleDeviceChange = (selectedOption) => {
        console.log(selectedOption);
        // setSelectedDevicesOptions(selectedOption); 
        // console.log(selectedDevicesOptions);
        setSelectedDashboard({ ...selectedDashboard, devices: selectedOption.map(device => device.value), variables: selectedOption.length === 0 ? [] : selectedDashboard.variables });
        // Lọc các variables có deviceId trùng với value của những thiết bị đã chọn
        const updatedVariablesOptions = selectedOption?.length?variablesOptions.filter((variable) => {
            // console.log('Checking variable:', variable);
            return selectedOption.some(option => {
            //   console.log('Checking option:', option);
              return option.value === variable.deviceId;
            });
          }):[];///BUG
        // console.log(updatedVariablesOptions)
        setVariablesOptionsByDevices(updatedVariablesOptions)
      };

    const handleVariableChange = (selectedOption) => {
        // console.log(selectedOption);
        // setSelectedVariablesOptions(selectedOption); 
        setSelectedDashboard({ ...selectedDashboard, variables: selectedOption.map(variable => variable.value) });
        // console.log(selectedVariablesOptions);
        // console.log(selectedDashboard);
      };

    const handleUpdate = async(e) => {
        e.preventDefault();
        await updateDashboard(selectedDashboard.id, { name: selectedDashboard.name, devices: selectedDashboard.devices, variables: selectedDashboard.variables });
        const updatedDashboards = dashboards.map(device =>
            device.id === selectedDashboard.id ? { ...device, name: selectedDashboard.name, devices: selectedDashboard.devices, variables: selectedDashboard.variables } : device
        );
        setDashboards(updatedDashboards);
        setIsModalOpen(false);
        setSelectedDashboard(null);
    };

    const handleDelete = (row) => {
        deleteDashboard(row.id);
        setDashboards((prevDashboards) => prevDashboards.filter((dashboard) => dashboard.id !== row.id));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDashboard(null);
        setIsAddDashboard(false)
    };

    // Tùy chỉnh các style
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            height: 'calc(100% - 1rem)', 
            backgroundColor: '#374151', // bg control
            borderColor: state.isFocused ? 'rgba(0,0,0, 0)' : 'rgba(209, 213, 219, 0)', // border focus
            boxShadow: state.isFocused ? '0 0 0 2px #ffffff' : 'none', // boxShadow
            '&:hover': {
                
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#e0e7ff' : '#ffffff', // bg select
            color: state.isSelected ? '#fff' : '#000',
            '&:hover': {
            backgroundColor: '#e5e5e5', // bg hover on option
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#2563EB', // bg select multi
            color: '#fff',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#fff',
            ':hover': {
            backgroundColor: '#e63946',
            color: 'white',
            },
        }),
        };
    // Fetch Dashboards

    useEffect(() => {
        const fetchDashboards = async () => {
            if (currentUser) {
                const dashboards = await getDashboardsByUserId(currentUser.uid);
                setDashboards(dashboards);
                console.log("Dashboards:", dashboards);
            }
        };
        fetchDashboards();
    }, [currentUser]);
    useEffect(() => {
        console.log("Updated selectedDevicesOptions:", selectedDashboard);
    }, [selectedDashboard]);
    
    // const { currentUser } = useAuth();
    // const { dashboards } = useLoaderData();

    return (
        <div>
            {/* {console.log(dashboards)} */}
            
            <Table
                columns={columns}
                data={dashboards}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                actions={false}
            />
            {/* update Dashboard */}
            <div
                id="updateProductModal"
                tabIndex={-1}
                className={`dark:bg-gray-800 dark:bg-opacity-30 overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isModalOpen ? "flex" : "hidden"}`}
            >                
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow-2xl shadow-black dark:bg-gray-800 sm:p-5">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Dashboard
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-toggle="updateProductModal"
                        onClick={closeModal}
                    >
                        <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    </div>
                    {/* Modal body */}
                    <form onSubmit={handleUpdate}>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2">
                            <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Ex. ESP32"
                                value={selectedDashboard?.name || ''}
                                onChange={(e) => setSelectedDashboard({ ...selectedDashboard, name: e.target.value })}
                            />
                            </div>
                            <div/>
                            <div>
                                <label
                                    htmlFor="dashboards"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Devices
                                </label>
                                <Select
                                    options={devicesOptions}
                                    value={
                                        selectedDashboard?.devices?.length
                                            ? devicesOptions.filter(option =>
                                                selectedDashboard.devices.includes(option.value)
                                              )
                                            : []
                                    }
                                    onChange={handleDeviceChange}
                                    isMulti
                                    styles={customStyles}
                                    className='p-0.5 bg-gray-700 rounded-lg border-gray-600 border'
                                    name="selectedDevices"
                                    id="selectedDevices"
                                    placeholder="Select dashboards"
                                />

                            </div>
                            <div>
                                <label
                                    htmlFor="variables"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Variables
                                </label>
                                <Select
                                    options={
                                        variablesOptionsByDevices.length > 0 
                                            ? variablesOptionsByDevices 
                                            : variablesOptions.filter(option =>
                                                selectedDashboard?.devices.includes(option.deviceId)
                                              )
                                    }
                                    value={
                                        selectedDashboard?.devices?.length
                                            ? variablesOptions.filter(option =>
                                                selectedDashboard.variables.includes(option.value)
                                              )
                                            : []
                                    }
                                    onChange={handleVariableChange}
                                    isMulti
                                    styles={customStyles}
                                    className='p-0.5 bg-gray-700 rounded-lg border-gray-600 border'
                                    name="selectedVariables"
                                    id="selectedVariables"
                                    placeholder="Select variables"
                                    noOptionsMessage={() => selectedDashboard?.devices?.length > 0 ? "No variables available" : "Select a device first"}
                                />

                            </div>
                        </div>
                        <div className="flex items-center space-x-4 justify-center">
                            <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                            Update dashboard
                            </button>
                            {/* <button
                            type="button"
                            className="text-red-600 inline-flex items-center hover:text-white border border-red-600 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                            onClick={()=>handleDelete()}
                            >
                            <svg
                                className="mr-1 -ml-1 w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                                />
                            </svg>
                            Delete
                            </button> */}
                        </div>
                    </form>
                </div>
                </div>
            </div>
            
            {/* Add Dashboard */}
            <div
                id="createProductModal"
                tabIndex={-1}
                className={`dark:bg-gray-800 dark:bg-opacity-30 overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isAddDashboard ? "flex" : "hidden"}`}
                role="dialog"
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow-2xl shadow-black dark:bg-gray-800 sm:p-5 ">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add Dashboard
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        data-modal-target="createProductModal"
                        data-modal-toggle="createProductModal"
                        onClick={closeModal}
                    >
                        <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    </div>
                    {/* Modal body */}
                    <form onSubmit={handleAddNewDashboard}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                        <label
                            htmlFor="name"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            name="dashboardName"
                            id="dashboardName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Type product name"
                            required=""
                        />
                        </div>
                        
                    </div>
                    <button
                        type="submit"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                        <svg
                        className="mr-1 -ml-1 w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                        />
                        </svg>
                        Add new product
                    </button>
                    </form>
                </div>
                </div>
            </div>

        </div>
    );
}

export default ListDashboards;