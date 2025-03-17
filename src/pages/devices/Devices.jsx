import React, { useState, useEffect } from 'react';
import Table from '../../components/Organisms/Table';
import { addDevice, deleteDevice, getDevicesByUserId, updateDevice } from '@/services/firebase/firestoreService';
import { listenStatusOfDeviceId } from '@/services/firebase/realtimeService';
import { useAuth } from "@/contexts/Auth";
import { Link } from 'react-router-dom';

export default function Devices() {
    const [devices, setDevices] = useState([]);
    
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddDevice, setIsAddDevice] = useState(false);
    // get current User
    const { currentUser } = useAuth();

    const columns = [
        {
            header: 'Device Name',
            key: 'name',
            render: (value, row) => <Link to={`/devices/${row.id}/setup`}>{value}</Link>,
        },
        {
            header: 'Status',
            key: 'status',
            render: (value) => (
                <span className={`
                    ${value === 'online' ? 'text-green-500' : 'text-red-500'
                    //  value === 'offline' ? 'text-red-500' : 
                    //  value === '' ? 'text-gray-500' : ''
                    }
                  `}>
                    {value === '' ? 'offline' : value}
                </span>
            ),
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
        setIsAddDevice(!isAddDevice);
    };

    const handleAddNewDevice = async (event) => {
        event.preventDefault();
        const newDevice = {
            name: event.target.deviceName.value,
            userId: currentUser.uid,
            status: "",       
            variables: ""          
        };
        
        // const { id, createTime } = await addDevice(newDevice);
        const docRef = await addDevice(newDevice);
        console.log("Device added with ID: ", docRef);
        const newDeviceWithId  = { ...newDevice, id: docRef.id };
        setDevices((prevDevices) => [...prevDevices, newDeviceWithId]);
        setIsAddDevice(false);
        event.target.reset();
      };

    const handleEdit = (row) => {
        setSelectedDevice(row);
        setIsModalOpen(true);
    };

    const handleUpdate = async(e) => {
        e.preventDefault();
        await updateDevice(selectedDevice.id, { name: selectedDevice.name });
        setDevices(prevDevices =>
            prevDevices.map(device =>
              device.id === selectedDevice.id
                ? { ...device, name: selectedDevice.name }
                : device
            )
          );
        setIsModalOpen(false);
        setSelectedDevice(null);
    };

    const handleDelete = async (row) => {
        console.log('Delete device', row);
        await deleteDevice(row.id);
        setDevices((prevDevices) => prevDevices.filter((device) => device.id !== row.id)); // Reload 
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDevice(null);
        setIsAddDevice(false)
    };

    // useEffect(() => {
    //     const fetchDevices = async () => {
    //         if (currentUser) {
    //             const devices = await getDevicesByUserId(currentUser.uid);
    //             setDevices(devices);
    //             console.log("Devices:", devices);
    //             devices.forEach((device) => {
    //                 listenStatusOfDeviceId(device.id, (status) => {
    //                   setDevices((prevDevices) =>
    //                     prevDevices.map((d) =>
    //                       d.id === device.id ? { ...d, status: status } : d
    //                     )
    //                   );
    //                 });
    //             });
    //         } else {
    //             console.log("User not authenticated");
    //         }
    //     }
    //     fetchDevices();
    // }, [currentUser]);
    useEffect(() => {
        let unsubscribeListeners = [];
    
        const fetchDevices = async () => {
          if (currentUser) {
            const devices = await getDevicesByUserId(currentUser.uid);
            setDevices(devices);
    
            devices.forEach((device) => {
              const unsubscribe = listenStatusOfDeviceId(device.id, (status) => {
                setDevices((prevDevices) =>
                  prevDevices.map((d) =>
                    d.id === device.id ? { ...d, status: status } : d
                  )
                );
              });
    
              unsubscribeListeners.push(unsubscribe);
            });
          }
        };
    
        fetchDevices();
    
        // Cleanup các listener khi component unmount
        return () => {
          unsubscribeListeners.forEach((unsubscribe) => unsubscribe());
        };
      }, [currentUser]);

    return (
        <div>
            <Table
                columns={columns}
                data={devices}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                actions={false}
            />
            {/* update Device */}
            <div
                id="updateProductModal"
                tabIndex={-1}
                className={`dark:bg-gray-800 dark:bg-opacity-30 overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isModalOpen ? "flex" : "hidden"}`}
            >                
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Device
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
                                name="updateName"
                                id="updateName"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Ex. ESP32"
                                value={selectedDevice?.name || ''}
                                onChange={(e) => setSelectedDevice({ ...selectedDevice, name: e.target.value })}
                            />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 justify-center">
                            <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                            Update device
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
            
            {/* Add Device */}
            <div
                id="createProductModal"
                tabIndex={-1}
                className={`dark:bg-gray-800 dark:bg-opacity-30 overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isAddDevice ? "flex" : "hidden"}`}
                role="dialog"
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add Device
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
                    <form onSubmit={handleAddNewDevice}>
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
                            name="deviceName"
                            id="deviceName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Device name"
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
                        Add new device
                    </button>
                    </form>
                </div>
                </div>
            </div>

        </div>
    );
}
