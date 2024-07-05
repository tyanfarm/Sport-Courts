import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({children}) => {
    const menuItem=[
        {
            path:"/",
            name:"Home"
        },
        {
            path:"/Court",
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