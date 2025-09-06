import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
    LuLogOut
} from "react-icons/lu";


export const SIDE_MENU_DATA = [
    {
        id: "01",
        name: "Dashboard",
        icon: LuLayoutDashboard,
        path :"/dashboard"
    },
    {
        id: "02",
        name: "Income",
        icon: LuWalletMinimal,
        path :"/income"
    },
    {
        id: "03",
        name: "Expense",
        icon: LuHandCoins,
        path :"/expense"
    },
    {
        id: "04",
        name: "Logout",
        icon: LuLogOut,
        path :"/logout"
    },
];