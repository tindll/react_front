import React from 'react'
import { Link } from "react-router-dom"
import { Sidebardt } from './Sidebardt'


import './navbar.css'

function Navbar() {
    return (
        <>
            <nav className = {"nav-menu align-items-center col-auto"} >
                <ul className = "nav-list">
                    {Sidebardt.map((item,index) => {
                        return (
                            <li key={index} className={item.classN} onClick={item.click}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
            
            
        </>
    )
}

export default Navbar;
