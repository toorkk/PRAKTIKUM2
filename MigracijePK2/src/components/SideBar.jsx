import React from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from "cdbreact";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      style={{ display: "flex", height: "100vh", overflow: "scroll initial" }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            MIGRACIJE.COM
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent>
          <CDBSidebarMenu>
            <NavLink>
              <CDBSidebarMenuItem>Dashboard</CDBSidebarMenuItem>
            </NavLink>
            <NavLink>
              <CDBSidebarMenuItem>Tables</CDBSidebarMenuItem>
            </NavLink>
            <NavLink>
              <CDBSidebarMenuItem>Profile page</CDBSidebarMenuItem>
            </NavLink>
            <NavLink>
              <CDBSidebarMenuItem>
                Analytics
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink>
              <CDBSidebarMenuItem>
                404 page
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: "center" }}>
          <div
            style={{
              padding: "20px 5px"
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
