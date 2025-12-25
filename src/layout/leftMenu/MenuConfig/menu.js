export const menuItems = [
  {
    menuName: 'Dashboard',
    menuIcon: '/src/assets/icons/home.svg',
    hasSubmenu: false,
    path: '/',
  },
  {
    menuName: 'Users',
    menuIcon: '/src/assets/icons/users.svg',
    hasSubmenu: true,
    submenuArray: [
      {
        menuName: 'All Users',
        menuIcon: '/src/assets/icons/users.svg',
        path: '/users',
      },
      {
        menuName: 'Add User',
        menuIcon: '/src/assets/icons/users.svg',
        path: '/users/add',
      },
    ],
  },
  {
    menuName: 'Settings',
    menuIcon: '/src/assets/icons/settings.svg',
    hasSubmenu: false,
    path: '/settings',
  },
];
