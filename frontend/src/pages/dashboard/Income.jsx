  import React, { useEffect } from 'react'
  import { useState } from 'react'
  import DashboardLayout from '../../components/layouts/DashboardLayout'
  import { API_PATHS } from '../../utils/apiPaths'
  import axiosInstance from "../../utils/axiosInstance"
  import IncomeOverview from '../../components/Income/IncomeOverview'
import { LuMoveDiagonal } from 'react-icons/lu'
import Modal from '../../components/layouts/Modal'
import AddIncomeForm from '../../components/Income/AddIncomeForm'
import { useUserAuth } from '../../hooks/useUserAuth'
import toast from 'react-hot-toast'

import IncomeList from '../../components/Income/IncomeList'
import DeleteAlert from '../../components/DeleteAlert'

  const Income = () => {

      useUserAuth();

    const [openAddIncomeModel, setOpenAddIncomeModel] = useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [loadig, setLoading] = useState(false);

     const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data:null,
     })
 
    const fetchIncomeData= async()=>{
           if(loadig) return;

            setLoading(true);

            try{
              const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`);

              if(response.data){
                setIncomeData(response.data);
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
      fetchIncomeData();
    },[])

    const handleAddIncome = async(data)=>{
      console.log(data);
      
       const {source ,amount,date,icon} = data;
        if(!source){
          toast.error("Source is required");
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
          const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
            source,
            amount,
            date,
            icon,
          });

          setOpenAddIncomeModel(false);
          toast.success("INcome added succesfully");
          fetchIncomeData();
        }
        catch(error){
          console.error("Error adding income ",
            error.response?.data?.message || error
          );
        }
        
    };

    const deleteIncome = async(id)=>{
          
       try {
          await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

           setOpenDeleteAlert({show:false,data:null});
           toast.success("Income details deleted successfully");
           fetchIncomeData();

       } catch (error) {
           console.error("Error deleting income",
            error.response?.data?.message || error.message);
       }

    }

    const handleDownloadIncomeDetails = async()=>{

          try {
                    
                   const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME,{
                     responseType: "blob",
                   });

                   console.log("download api",response);
         
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement("a");
                  link.href= url;
                  link.setAttribute("download","income_details.xlsx");
                  document.body.appendChild(link);
         
                  link.click();
                  link.parentNode.removeChild(link);
                  window.URL.revokeObjectURL(url);
         
         
                  } catch (error) {
                    console.error("Error downloading expense",error);
                  }
         
    }




    return (
      <DashboardLayout activeMenu="Income">

       <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
       
         <div className=''>
          <IncomeOverview 
          transactions={incomeData}
          onAddIncome = {()=>setOpenAddIncomeModel(true)}
          />
         </div>

          <IncomeList 
          transactions={incomeData}
          onDelete={(id)=>{
            setOpenDeleteAlert({show:true,data:id});
          }}
          onDownload={handleDownloadIncomeDetails}
          />


        </div>
 
      <Modal 
      isOpen = {openAddIncomeModel}
      onClose = {()=> setOpenAddIncomeModel(false)}
      title= "Add Income"

       >
        <AddIncomeForm onAddIncome={handleAddIncome} />

        </Modal>

    <Modal 
    isOpen={openDeleteAlert.show}
    onClose={()=>setOpenDeleteAlert({show:false,data:null})}
    title="Delete Income"
    >


    <DeleteAlert
    content="Are you sure you want to delete this income" 
    onDelete={()=> deleteIncome(openDeleteAlert.data)}
    />

    </Modal>    



       </div>



      </DashboardLayout>
    )
  }
  
  export default Income
  