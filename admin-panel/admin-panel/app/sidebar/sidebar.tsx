import LogoutIcon from '@mui/icons-material/Logout';
import {NavLink} from 'react-router';

const Sidebar = () => {
  const navItems = [
    {name: 'Competitions', path: '/competition'},
    {name: 'Posts', path: '/posts'},
    {name: 'Users', path: '/users'},
    {name: 'Profile', path: '/profile'},
    {name: 'Settings', path: '/settings'},
    {name: 'Simulation', path: '/simulation'},
  ];

  return (
    <div className="h-screen w-64 bg-neutral-950 text-white flex flex-col justify-between border-r border-neutral-900">
      <div className="space-y-2 px-4 py-2">
        <NavLink to={'/'} className="flex text-2xl p-4 font-medium  text-left ">
          Clout Admin
        </NavLink>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({isActive}) =>
              `block px-4 py-2 rounded-lg hover:bg-neutral-800 transition text-s hover:text-white ${
                isActive ? 'bg-neutral-800 text-white' : 'text-neutral-400'
              }`
            }>
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Logout at bottom */}
      <div className="p-2 border-t border-neutral-900">
        <button
          onClick={() => console.log('Logout')}
          className="text-red-500 text-s text-left px-4 py-2 rounded-lg hover:text-red-800 transition flex items-center gap-2">
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
