import React from 'react'
import { API_PATHS } from '../../utils/apiPaths';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useState,useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseList from '../../components/Expense/ExpenseList';
import Modal from '../../components/layouts/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import DeleteAlert from '../../components/DeleteAlert';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';


const Expense = () => {

   useUserAuth();
  
      const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false);
      const [expenseData, setExpenseData] = useState([]);
      const [loadig, setLoading] = useState(false);
  
       const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data:null,
       });

         const fetchExpenseData= async()=>{
           if(loadig) return;

            setLoading(true);

            try{
              const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE);

              if(response.data){
                setExpenseData(response.data);
              }
            }
            catch(error){
              console.log("Error in ",error);
            }
            finally{
              setLoading(false);
            }
    };

    useEffect(()=>{
      fetchExpenseData();
    },[])

    const handleAddExpense = async(data)=>{
      console.log(data);
      
       const {category ,amount,date,icon} = data;
        if(!category){
          toast.error("Category is required");
          return;
        }

        if(!amount || isNaN(amount) || Number(amount)<=0){
          toast.error("Amount should be valid");
          return;
        }

        if(!date){
          toast.error("Date is required");
        }

        try{
          const response = await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
            category,
            amount,
            date,
            icon,
          });

          setOpenAddExpenseModel(false);
          toast.success("INcome added succesfully");
          fetchExpenseData();
        }
        catch(error){
          console.error("Error adding income ",
            error.response?.data?.message || error
          );
        }
        
    };

    const deleteExpense = async(id)=>{
          
       try {
          await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

           setOpenDeleteAlert({show:false,data:null});
           toast.success("Income details deleted successfully");
           fetchExpenseData();

       } catch (error) {
           console.error("Error deleting income",
            error.response?.data?.message || error.message);
       }

    }

    const handleDownloadExpenseDetails = async()=>{
        
         try {
           
          const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
            responseType: "blob",
          });

         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement("a");
         link.href= url;
         link.setAttribute("download","expense_details.xlsx");
         document.body.appendChild(link);

         link.click();
         link.parentNode.removeChild(link);
         window.URL.revokeObjectURL(url);


         } catch (error) {
           console.error("Error downloading expense",error);
         }
    }

   
  

  return (
   <DashboardLayout activeMenu="Expense">


       <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
       
         <div className=''>
          <ExpenseOverview 
          transactions={expenseData}
          onAddExpense = {()=>setOpenAddExpenseModel(true)}
          />
         </div>

          <ExpenseList 
          transactions={expenseData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id});
          }}
          onDownload={handleDownloadExpenseDetails}
          />


        </div>
 
      <Modal 
      isOpen = {openAddExpenseModel}
      onClose = {()=> setOpenAddExpenseModel(false)}
      title= "Add Expense"

       >
        <AddExpenseForm onAddExpense={handleAddExpense} />

        </Modal>

    <Modal 
    isOpen={openDeleteAlert.show}
    onClose={()=>setOpenDeleteAlert({show:false,data:null})}
    title="Delete Expense"
    >


    <DeleteAlert
    content="Are you sure you want to delete this Expense" 
    onDelete={()=> deleteExpense(openDeleteAlert.data)}
    />

    </Modal>    



       </div>



      </DashboardLayout>
    )
  }
  


export default Expense
