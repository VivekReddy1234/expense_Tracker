import React from 'react'
import { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from "../Charts/CustomBarChart" 
import { prepareExpenseLineChartData } from '../../utils/helper';

const ExpenseOverview = ({transactions,onAddExpense}) => {

   const [chartData,setChartData] = useState([]);

  useEffect(()=>{
 
     const result = prepareExpenseLineChartData(transactions);
     console.log("The Result is ",result);

     setChartData(result);
     
     console.log("Chart Data",chartData);

  },[transactions])

  return (
    <div className='card'>

      <div className=' flex items-center justify-between'> 
      
        <div className='' >
         
           <h5 className=' text-lg' > Expense Overview</h5>
          
          <p className=' text-xs text-gray-400 mt-0.5'>
            Track Your earnings over time and analyze your expense 
          </p>

      </div>

      <button className=' add-btn' onClick={onAddExpense}>
  
   <LuPlus className=' text-lg' />
      Add Expense

      </button>
      
    </div>
     
       <div className=' mt-10' >
      
        <CustomBarChart data={chartData} />

       </div>

     </div>
  )
}

export default ExpenseOverview
