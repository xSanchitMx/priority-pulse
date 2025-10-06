import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import SideMenu from './SideMenu';
import Navbar from './Navbar';

const DashboardLayout = ({children, activeMenu}) => {
  const{ user} = useContext(UserContext);

  return (
    <div className="">
        <Navbar activeMenu={activeMenu}></Navbar>

        {user && (
            <div className="flex">
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className="">{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout