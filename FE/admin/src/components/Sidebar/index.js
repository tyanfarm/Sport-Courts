import React, { useContext } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

const Sidebar = ({children}) => {
    const token = localStorage.getItem('AT');

    // if (!token) {
    //     return <Navigate to="/AdminLogin" />;
    // }

    const menuItem=[
        {
            path:"/",
            name:"Home"
        },
        {
            path:"/Courts",
            name:"Courts"
        },
        {
            path:"/Category",
            name:"Categories"
        },
        {
            path:"/Order",
            name:"Orders"
        },
        {
            path:"/OrderDetail",
            name:"Order Details"
        },
    ];

    return (
        <div className="sidebar container">
            <div className="sidebar index">
                {menuItem.map((item, index)=>(
                    <NavLink to={item.path} key={index} className="sidebar link" activeclassName="active">
                        <div className="sidebar name-link">{item.name}</div>
                    </NavLink>
                ))}
            </div>
            <main>{children}</main>
        </div>
    )
}

export default Sidebar;