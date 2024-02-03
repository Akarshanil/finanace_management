import React, { useState, useEffect } from 'react';
import './ExpenseManager.css';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ExpenseManager() {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [newExpense, setNewExpense] = useState({
        name: '',
        category: '',
        date_of_expense: '',
        amount: ''
    });
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [expenseRequests, setExpenseRequests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage,setCurrentPage]=useState(1);
    const [loggedInUserId,setloggedInUserId]=useState()
    const recordsPerPage=4;
    const lastIndex = currentPage *  recordsPerPage; 
    const firstIndex = lastIndex -recordsPerPage;
    const records =expenseRequests.slice(firstIndex,lastIndex)
    const npage =Math.ceil(expenseRequests.length/recordsPerPage)
    const numbers =[...Array(npage+1).keys()].slice(1)

    useEffect(() => {
        fetchExpenseRequests();
    }, []);

    const fetchExpenseRequests = async () => {
        try {
            const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
            setloggedInUserId(userId)

            const response = await fetch(`http://127.0.0.1:8000/finance_management/expense_requests/?userid=${encodeURIComponent(userId)}`);
            const data = await response.json();
            setExpenseRequests(data);

        } catch (error) {
            console.error('Error fetching expense requests:', error);
        }
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (selectedExpense) {
            setSelectedExpense({
                ...selectedExpense,
                [name]: value
            });
        } else {
            setNewExpense({
                ...newExpense,
                [name]: value
            });

        }
    };
    const handleModalToggle = () => {
        setShowModal(!showModal);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedExpense(null); 
    };
    const handleNewExpenseSubmit = async () => {
        try {
            const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : null;
            let expenseData;
    
            if (selectedExpense) {

                expenseData = {
                    ...selectedExpense,
                };
            } else {
                expenseData = {
                    ...newExpense,
                };
            }
    
            const requestBody = {
                expenseData: expenseData,
                userId: userId
            };
    
            const url = selectedExpense ? `http://127.0.0.1:8000/finance_management/expense_requests_upd/${selectedExpense.id}/` : 'http://127.0.0.1:8000/finance_management/expense_requests/';
            const method = selectedExpense ? 'PUT' : 'POST';
    
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });
    
            const responseData = await response.json();
            
    
            if (response.ok) {
                Swal.fire({
                    title: 'Success!',
                    text: responseData.message,
                    icon: 'success'
                });
                setNewExpense({
                    name: '',
                    category: '',
                    date_of_expense: '',
                    amount: ''
                });
                setShowModal(false);
                fetchExpenseRequests();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: responseData.message || 'Failed to save expense',
                    icon: 'error'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to save expense',
                icon: 'error'
            });
        }
    };
    
    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setShowModal(true);
    };
    const handleDeletePrompt = (expense) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this expense!',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteExpense(expense);
            }
        });
    };
    const handleDeleteExpense = async (expense) => {
        try {
            const expenseIdToDelete = expense.id;
    
            const response = await fetch(`http://127.0.0.1:8000/finance_management/expense_requests_upd/${expenseIdToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                setExpenseRequests(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseIdToDelete));
    
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Expense has been deleted.',
                    icon: 'success'
                });
            } else {
                throw new Error('Failed to delete expense');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete expense',
                icon: 'error'
            });
        } 
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendSearchQueryToBackend(searchQuery);
        }
    };
    const sendSearchQueryToBackend = async (query) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/finance_management/expense_requests/?query=${encodeURIComponent(query)}&userid=${loggedInUserId}`, {
                method: 'GET',
            });
    
            const data = await response.json();
            setExpenseRequests(data);

            console.log('Search response:', data);
            
        } catch (error) {
            console.error('Error sending search query:', error);
        }
    };
    const handleFilterDataKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendFilterDataToBackend(startDate);
        }
    };
    
    const sendFilterDataToBackend = async (filterData) => {
        console.log("Filter Data:", filterData);
        try {
            const response = await fetch(`http://127.0.0.1:8000/finance_management/expense_requests/?filter_data=${encodeURIComponent(filterData)}&userid=${loggedInUserId}`, {
                method: 'GET',
            });
    
            if (response.ok) {
                const data = await response.json();
                setExpenseRequests(data);
                setExpenseRequests(data);

                console.log('Filter response:', data);
            } else {
                console.error('Error:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error sending filter data:', error);
        }
    };
    function formatUpdatedAt(updatedAt) {
        if (!updatedAt) {
            return ''; 
        }
        const updatedAtDate = new Date(updatedAt);
        const now = new Date();
        const delta = now - updatedAtDate;
    
        if (delta >= 86400000) { 
            const days = Math.floor(delta / 86400000);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (delta >= 3600000) { 
            const hours = Math.floor(delta / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (delta >= 60000) { 
            const minutes = Math.floor(delta / 60000);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    }
    
    
    return (
        <div className="container">
            <div className="left-side1">
                <h2 className='heading_name'>MY EXPENSE MANAGER</h2>
            </div>
            <div className="right-side1">
            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    placeholderText="Filter by date of expense"
                    className='date-filter'
                    onChange={(date) => setStartDate(date)} 
                    onKeyDown={handleFilterDataKeyPress} 
                />
            </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Expense by Name"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="new-expense-button" onClick={handleModalToggle}><i className="fa-solid fa-plus"></i> New Expense</button>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content_data">
                        <h2>{selectedExpense ? 'Edit Expense' : 'Add New Expense'}</h2>
                        <form>
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder='Enter the Name'
                                value={selectedExpense ? selectedExpense.name : newExpense.name}
                                onChange={handleInputChange}
                            />

                            <label htmlFor="category">Category:</label>
                            <select
                                id="category"
                                name="category"
                                value={selectedExpense ? selectedExpense.category : newExpense.category}
                                onChange={handleInputChange}
                                className='selectcat'
                            >
                                <option value="">Select</option>
                                <option value="Health">Health</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Travel">Travel</option>
                                <option value="Education">Education</option>
                                <option value="Books">Books</option>
                                <option value="Others">Others</option>
                            </select>

                            <label htmlFor="date_of_expense">Date of Expense:</label>
                            <input
                                type="date"
                                id="date_of_expense"
                                name="date_of_expense"
                                placeholder='Enter the date of expense'
                                value={selectedExpense ? selectedExpense.date_of_expense : newExpense.date_of_expense}
                                onChange={handleInputChange}
                            />

                            <label htmlFor="amount">Amount:</label>
                            <input
                                type="text"
                                id="amount"
                                name="amount"
                                placeholder='Enter the amount'
                                value={selectedExpense ? selectedExpense.amount : newExpense.amount}
                                onChange={handleInputChange}
                            />

                            <button
                                type="button"
                                className='submitmodal'
                                onClick={handleNewExpenseSubmit}
                            >
                                {selectedExpense ? 'Update Expense' : 'Create Expense'}
                            </button>
                        </form>
                        <span className="close" onClick={handleModalClose}>Close</span>
                    </div>
                </div>
            )}

            <table className="expense-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Date of Expense</th>
                        <th>Amount</th>
                        <th>Updated at</th>
                        <th>Created by</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(records) && records.map((expense) => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{expense.category}</td>
                            <td>{expense.date_of_expense}</td>
                            <td>{expense.amount}</td>
                            <td>{formatUpdatedAt(expense.updated_at)}</td>
                            <td>
                                {loggedInUserId === expense.user.id ? (
                                    <span>Me</span>
                                ) : (
                                    <span>{expense.user.email}</span>
                                )}
                            </td>

                            <td>
                                <div>
                                    {loggedInUserId === expense.user.id && (
                                        <>
                                            <a className="addeditbutton" onClick={() => handleEditExpense(expense)}>
                                                <i className="fa-solid fa-pen-to-square pen_custom-icon"></i>
                                            </a>
                                            <a className='deletebutton' onClick={() => handleDeletePrompt(expense)}>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </a>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
              <ul className='pagination'>
                <li className='page-item'>
                    <a href='#' className='page-link' onClick={prePage}>
                        Previous
                    </a>
                </li>
                {
                    numbers.map((n,i)=>(
                        <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                        <a href='#' className='page-link' onClick={()=>changeCPage(n)}>{n}</a>
                       </li> 
                    ))
                }
                <li className='page-item'>
                    <a href='#'className='page-link' onClick={nextPage}>Next</a>
                </li>
                </ul>  
            </nav>
         </div>
    );
    function prePage(){
        if(currentPage!==1){
            setCurrentPage(currentPage -1);
        }

    }
    function changeCPage(id){
        setCurrentPage(id)

    }
    function nextPage(){
        if(currentPage !== npage){
            setCurrentPage(currentPage +1) ;
        }

    }
}

export default ExpenseManager;
