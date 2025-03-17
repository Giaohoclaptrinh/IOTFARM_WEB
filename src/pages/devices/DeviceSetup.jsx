import React, { useState, useEffect } from 'react';
import Table from '@/components/Organisms/Table';
import { addVariable, getVariablesByDeviceId, deleteVariable, updateVariable } from '@/services/firebase/firestoreService';
import { listenVariablesByDeviceId } from '@/services/firebase/realtimeService';
import { useAuth } from "@/contexts/Auth";
import { useParams } from 'react-router-dom';

export default function VariableSetup() {
  const [variables, setVariables] = useState([]);
    
    const [selectedVariable, setSelectedVariable] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddVariable, setIsAddVariable] = useState(false);
    // get current User
    const { currentUser } = useAuth();
    const { deviceId } = useParams(); 

    const columns = [
        {
            header: 'Name',
            key: 'name'
        },
        {
            header: 'Last value',
            key: 'lastValue',
            render: (value) => (
                <span className="text-gray-500">{value === '' ? '---' : value}</span>  
            )
        },
        {
            header: 'Last update',
            key: 'lastUpdate',
        },

    ];

    const handleAdd = () => {
        setIsAddVariable(!isAddVariable);
    };

    const handleAddNewVariable = async (event) => {
        event.preventDefault();
        console.log(deviceId)
        const newVariable = {
            name: event.target.variableName.value,
            userId: currentUser.uid,
            deviceId: deviceId,
            lastValue: ""
        };
        
        // const { id, createTime } = await addVariable(newVariable);
        const docRef = await addVariable(newVariable);
        console.log("Variable added with ID: ", docRef.id);
        // const newVariableWithId  = { ...newVariable, id: docRef.id };
        // setVariables((prevVariables) => [...prevVariables, newVariableWithId]);
        setIsAddVariable(false);
        event.target.reset();
      };

    const handleEdit = (row) => {
        setSelectedVariable(row);
        setIsModalOpen(true);
    };

    const handleUpdate = async(e) => {
        e.preventDefault();
        await updateVariable(selectedVariable.id, { name: selectedVariable.name });
        setVariables(prevVariables =>
            prevVariables.map(variable =>
              variable.id === selectedVariable.id
                ? { ...variable, name: selectedVariable.name }
                : variable
            )
          );
        setIsModalOpen(false);
        setSelectedVariable(null);
    };

    const handleDelete = async (row) => {
        console.log('Delete variable', row);
        await deleteVariable(row.id);
        setVariables((prevVariables) => prevVariables.filter((variable) => variable.id !== row.id)); // Reload 
        setSelectedVariable(null);       
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVariable(null);
        setIsAddVariable(false)
    };

    // useEffect(() => {
    //     const fetchVariables = async () => {
    //         if (currentUser) {
    //             const variables = await getVariablesByDeviceId(deviceId);
    //             setVariables(variables);
    //             console.log("Variables:", variables);
    //         } else {
    //             console.log("User not authenticated");
    //         }
    //     }
    //     fetchVariables();
    // }, [currentUser]);

    useEffect(() => {
        const unsubscribe = listenVariablesByDeviceId(deviceId, setVariables);
        return () => unsubscribe();
    }, [deviceId]);

    return (
        <div>
            <Table
                columns={columns}
                data={variables}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                actions={false}
            />
            {/* update Variable */}
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
                        Edit Variable
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
                                value={selectedVariable?.name || ''}
                                onChange={(e) => setSelectedVariable({ ...selectedVariable, name: e.target.value })}
                            />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 justify-center">
                            <button
                            type="submit"
                            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                            Update variable
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
            
            {/* Add Variable */}
            <div
                id="createProductModal"
                tabIndex={-1}
                className={`dark:bg-gray-800 dark:bg-opacity-30 overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isAddVariable ? "flex" : "hidden"}`}
                role="dialog"
            >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                {/* Modal content */}
                <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                    {/* Modal header */}
                    <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Add Variable
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
                    <form onSubmit={handleAddNewVariable}>
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
                            name="variableName"
                            id="variableName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Variable name"
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
                        Add new variable
                    </button>
                    </form>
                </div>
                </div>
            </div>

        </div>
    );
}
