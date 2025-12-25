import React, { useRef } from 'react'
import { Menu } from 'primereact/menu'
import { Avatar } from 'primereact/avatar'

const TopHeader = () => {
  const menu = useRef(null)

  const userMenuItems = [
    {
      template: () => (
        <div className="px-3 py-2">
          <p className="font-semibold text-gray-800">Babor</p>
          <p className="text-sm text-gray-500">babor@email.com</p>
        </div>
      ),
    },
    { separator: true },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        console.log('logout clicked')
      },
    },
  ]

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">

      <h1 className="text-lg font-semibold text-gray-800">
        The Mighty Babor Project
      </h1>

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-600">Babor</span>

        {/* Avatar Click */}
        <Avatar
          label="B"
          shape="circle"
          className="cursor-pointer bg-slate-300 text-gray-800"
          onClick={(e) => menu.current.toggle(e)}
        />

        {/* Dropdown Menu */}
        <Menu model={userMenuItems} popup ref={menu} />
      </div>

    </header>
  )
}

export default TopHeader
