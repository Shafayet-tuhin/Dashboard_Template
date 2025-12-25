import React, { useState } from "react";
import { menuItems } from "./MenuConfig/menu";
import { useNavigate } from "react-router-dom";

const LeftMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  return (
    <aside
      className={`bg-gray-900 text-slate-200 h-full transition-all duration-200
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-gray-700">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <div className="h-8 w-8 bg-white text-slate-900 rounded flex items-center justify-center font-bold">
            P
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm">Project Name</span>
          )}
        </div>

        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-lg">
            ◀
          </button>
        )}
      </div>

      <nav className="p-2">
        {menuItems.map((menu, index) => (
          <div key={index}>
            <div
              onClick={() => {
                if (menu.hasSubmenu) {
                  setOpenMenu(openMenu === index ? null : index);
                } else if (menu.path) {
                  navigate(menu.path);
                }
              }}
              className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-slate-700"
            >
              <img
                src={menu.menuIcon}
                alt={menu.menuName}
                className="h-5 w-5"
              />

              {!collapsed && (
                <>
                  <span className="flex-1">{menu.menuName}</span>
                  {menu.hasSubmenu && <span>▾</span>}
                </>
              )}
            </div>

            {menu.hasSubmenu && openMenu === index && !collapsed && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                {menu.submenuArray.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => navigate(sub.path)}
                    className="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-slate-700 cursor-pointer"
                  >
                    <img
                      src={sub.menuIcon}
                      alt={sub.menuName}
                      className="h-4 w-4"
                    />
                    <span>{sub.menuName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default LeftMenu;
