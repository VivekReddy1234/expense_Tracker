import moment from "moment";
import { data } from "react-router-dom";

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export const addThousandSeperator = (num)=>{
   
   if(num==null || isNaN(num)) return "";

   const [integerPart, fractionalPart] = num.toString().split(".");

  // Add commas to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Return with fractional part if it exists
  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
}

export const prepareExpenseBarChartData=(data)=>{
     
   const chartData = data.map((item)=>(
    {  category: item?.category,
      amount: item?.amount,
    }
   ));

    return chartData;
};


export const prepareIncomeBarChartData=(data=[])=>{
  const sortedData = [...data].sort((a,b)=> new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item)=>(
    {
      month : moment(item?.date).format("Do MMM YYYY"),
      amount : item?.amount,
      source : item?.source,
    }
  ));

   return chartData;

}

export const prepareExpenseLineChartData=(data=[])=>{
  const sortedData = [...data].sort((a,b)=> new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item)=>(
    {
      month : moment(item?.date).format("Do MMM YYYY"),
      amount : item?.amount,
      category : item?.category,
    }
  ));

   return chartData;

}


