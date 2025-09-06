import { useContext, useEffect } from "react"
import { UserContext } from "../context/userContext"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = ()=>{
     
     const {user,updateUser,clearUser} = useContext(UserContext);

     const navigate = useNavigate();

     useEffect(()=>{
         if(user) return;

          let isMounted = true;

          const fetchUserInfo = async()=>{
            try{
                const response = await axiosInstance.get("/api/v1/auth/getuser");
              {
                console.log(response);
              }
                if(isMounted && response.data){
                    updateUser(response.data);
                }
            }

            catch(error){
             if(error.response?.status === 401){
            clearUser();
           navigate('/login');
         } else {
       console.error("Other error:", error);
            }

            }
          };
     

     fetchUserInfo();

     return ()=>{
        isMounted = false;
     };

},[updateUser,clearUser,navigate]);

}