import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/userContext";
import { BASE_URL } from "../../utils/apiPaths";

 import { Navigate, useNavigate } from "react-router-dom";

const SideMenu = ({ activeMenu }) => {
   
    const {user,clearUser} = useContext(UserContext);
   const navigate = useNavigate();
   
  


    const handleClick = (route)=>{
        if(route === "/logout"){
             handleLogout();
             return;
        }
        navigate(route);

    };

    const handleLogout = () => {
        clearUser();
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className=" w-64 h-[calc(100vh-70px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
            <div className=" flex flex-col items-center justify-center gap-3 mt-3 mb-7" >
                {
                    user?.profileImageUrl ? (
                        <img
                      src={`${BASE_URL}${user?.profileImageUrl}`}
                        alt="Profile"
                        className=" w-20 h-20 bg-slate-400 rounded-full border border-b " />): <></>
                }
            <h5 className=" text-gray-900 font-medium leading-6">
                {user?.fullName || "User"}

            </h5>
            </div>

        { SIDE_MENU_DATA.map((item,index)=>(
            <button
            key={`menu_${index}`}
            className={` w-full flex items-center gap-4 text-[15px] ${activeMenu == item.name? "text-white bg-purple-900 ":""} py-3 px-6 rounded-lg mb-3 ` }
            onClick={() => handleClick(item.path)}

            >
                <item.icon className=" text-xl"/>
                {item.name}
            </button>
        ))
       
       };

        </div>
    );
}

export default SideMenu;