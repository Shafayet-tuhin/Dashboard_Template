import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TopHeader from "./topHeader/TopHeader";
import LeftMenu from "./leftMenu/LeftMenu";

const Layout = () => {
  return (
    <div className="h-screen flex">
      <LeftMenu />

      <div className="flex flex-col flex-1">
        <TopHeader />

        <main className="flex-1 bg-slate-100 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
