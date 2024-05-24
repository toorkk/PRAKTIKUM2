import React from "react";
import { NavLink } from "react-router-dom";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from "cdbreact";
import "../Sidebar.css"; 

const CustomSidebarMenuItem = ({ icon = 'fa fa-map', text = 'Default Text', to = '/' }) => {
  return (
    <CDBSidebarMenuItem>
      <NavLink to={to} className="nav-link">
        <i className={icon}></i> {text}
      </NavLink>
    </CDBSidebarMenuItem>
  );
};

const Sidebar = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: "inherit" }}>
            MIGRACIJE.COM
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent>
          <CDBSidebarMenu>
            <CustomSidebarMenuItem to="/map" icon="fa fa-map" text="MAP" />
            <CustomSidebarMenuItem to="/podrobnosti" icon="fa fa-info-circle" text="PODROBNOSTI" />
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div style={{ padding: "20px 5px" }}>FOOTER</div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
