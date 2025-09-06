import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx'
import { useUserAuth } from '../../hooks/useUserAuth.jsx'
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { set } from 'mongoose';
import {LuHandCoins, LuWalletMinimal} from "react-icons/lu";
import {IoMdCard} from "react-icons/io";
import { addThousandSeperator } from '../../utils/helper.js';
import InfoCard from '../../Cards/InfoCard.jsx';
import RecentTransactions from '../../components/Dashboard/RecentTransactions.jsx';
import FinanceOverview from '../../components/Dashboard/FinanceOverview.jsx';
import { useNavigate } from 'react-router-dom';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions.jsx';
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses.jsx"
import RecentIncomeWithChart from '../../components/Charts/RecentIncomeWithChart.jsx';
import RecentIncome from '../../components/Dashboard/RecentIncome.jsx';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
 
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async()=>{
         if(loading) return;
         
           setLoading(true);

           try{
       const response = await axiosInstance.get('/api/v1/dashboard');
         console.log(response);
       if(response.data){
        setDashboardData(response.data);
       }

           }
           catch(error){
             console.log("Something Went Wrong",error);
           }
           finally{
            setLoading(false);
           } 
    };

    useEffect(()=>{
      fetchDashboardData();
      return ()=>{};
    },[]);

  return (
    <DashboardLayout activeMenu="Dashboard">
    <div className=' my-5 mx-auto'>
    <div className=' grid grid-cols-1 md:grid-cols-3 gap-6' >
      
       <InfoCard 
       icon ={<IoMdCard />}
       label = "Total Balance"
       value = {addThousandSeperator(dashboardData?.balance)}
       color = "bg-purple-600"
       />

         <InfoCard 
       icon ={<LuWalletMinimal />}
       label = "Total Income"
       value = {addThousandSeperator(dashboardData?.totalIncome || 0)}
       color = "bg-orange-600"
       />

         <InfoCard 
       icon ={<LuHandCoins />}
       label = "Total Expense"
       value = {addThousandSeperator(dashboardData?.totalExpense || 0)}
       color = "bg-red-600"
       />


    </div>

    <div className=' grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 '>
   
     <RecentTransactions
      
       transactions ={dashboardData?.recentTransactions}
       onSeeMore={()=> navigate("/expense")}

     />

      <FinanceOverview
      totalBalance ={dashboardData?.balance || 0}
      totalIncome = {dashboardData?.totalIncome || 0}
      totalExpense ={dashboardData?.totalExpense || 0}
       />


       <ExpenseTransactions 
       transactions={dashboardData?.last60DaysExpense?.transactions || []}
       onSeeMore={()=> navigate("/expense")}
         />


          <Last30DaysExpenses
          data={dashboardData?.last60DaysExpense?.transactions || []}
           />

           <RecentIncomeWithChart 
           data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
           totalIncome = {dashboardData?.totalIncome || 0}

            />

            <RecentIncome 
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={()=>navigate("/income")}
            />

    </div>
        
    </div>
    </DashboardLayout>
  )
}

export default Home
