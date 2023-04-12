import React from 'react';
import {
  CDBSidebar,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarFooter,
} from 'cdbreact';

const Sidebar = () => {
  return (
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars" />}>Toggle</CDBSidebarHeader>
        <CDBSidebarContent>
          <CDBSidebarMenu>
            <CDBSidebarMenuItem icon="th-large" iconSize="lg">
              Dashboard
            </CDBSidebarMenuItem>
            <CDBSidebarMenuItem icon="sticky-note" iconSize="sm">
              Components
            </CDBSidebarMenuItem>
            <CDBSidebarMenuItem icon="credit-card" iconType="solid" textFontSize="14px">
              Sales
            </CDBSidebarMenuItem>
            <CDBSidebarMenuItem icon="gamepad" iconType="solid" textFontSize="14px">
              Games
            </CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div className="sidebar-btn-wrapper" style={{padding: '20px 5px'}}>
            Sidebar Footer
          </div>
        </CDBSidebarFooter>

      </CDBSidebar>
  )
};

export default Sidebar;