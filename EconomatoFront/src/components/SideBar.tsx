import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import logoSmart from '../assets/logoSmart.png';
import { UserProfile } from './UserProfile';


// --- COMPONENTE PRINCIPAL: SideBar ---
export default function SideBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-2 py-2 rounded-base group transition-colors ${
      isActive
        ? "bg-neutral-tertiary text-fg-brand font-semibold shadow-sm"
        : "text-body hover:bg-neutral-tertiary hover:text-fg-brand"
    }`;

  return (
    <>
      <button 
        data-drawer-target="logo-sidebar" 
        type="button" 
        className="text-heading p-2 ms-3 mt-3 rounded-base inline-flex sm:hidden hover:bg-neutral-secondary-medium"
      >
        <span className="sr-only">Abrir menú</span>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-60 h-full transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="flex flex-col h-full px-3 py-4 bg-neutral-primary-soft border-default">
          
          <div className="flex-grow overflow-y-auto">
            <Link to="/" className="flex items-center ps-2.5 mb-8">
              <img src={logoSmart} className="h-8 me-3" alt="Logo Smart Economato" />
              <span className="self-center text-lg text-heading font-bold tracking-tight">Smart Economato</span>
            </Link>

            <ul className="space-y-1.5 font-medium">
              

              <li>
                <NavLink to="/inventario" className={linkClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="ms-3">Inventario</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/recepcion" className={linkClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="ms-3">Recepcionar</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 ms-auto text-[10px] font-bold text-white bg-red-500 rounded-full">2</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/pedidos" className={linkClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="ms-3">Pedidos</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/registrar" className={linkClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="ms-3">Registrar producto</span>
                </NavLink>
              </li>

               <li>
                <NavLink to="/admin-usuarios" className={linkClass}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="ms-3">Administrar usuarios</span>
                </NavLink>
              </li>

            </ul>
          </div>

          <UserProfile />
          
        </div>
      </aside>
    </>
  );
}