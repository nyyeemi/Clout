import {useEffect} from 'react';

import {useSelector} from 'react-redux';
import {type LoaderFunctionArgs, redirect, useNavigate} from 'react-router';
import {logoutAndReset} from '~/redux/slices/authSlice';
import type {RootState} from '~/redux/store/store';

import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    {title: 'Admin Dashboard'},
    {name: 'description', content: 'Welcome to clout enterprises. '},
  ];
}

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 h-screen p-4 items-center justify-center bg-neutral-950 px-4">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary bg-transparent sm:text-6xl drop-shadow-2xl drop-shadow-neutral-900">
          Welcome.
        </h1>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/competition')}
            className="bg-primary hover:text-white text-neutral-400 px-6 py-3 rounded-xl text-sm font-medium transition">
            Competitions
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="bg-secondary  hover:text-neutral-50 text-neutral-400 px-6 py-3 rounded-xl text-sm font-medium transition">
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
