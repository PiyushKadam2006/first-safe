import React from 'react';
import { LayoutDashboard, ShieldAlert, Settings, Map as MapIcon, BarChart3, Info } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: 'Live Map', icon: <MapIcon size={20} />, label: 'Live Map' },
    { id: 'Analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { id: 'Incidents', icon: <ShieldAlert size={20} />, label: 'Incidents' },
  ];

  return (
    <div className="sidebar" style={{
      width: '260px',
      backgroundColor: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px',
      flexShrink: 0
    }}>
      <div className="logo" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <div style={{
          backgroundColor: 'var(--accent)',
          padding: '8px',
          borderRadius: '10px'
        }}>
          <ShieldAlert color="white" size={24} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '-0.5px' }}>RoadSoS</h1>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onTabChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '4px',
              cursor: 'pointer',
              color: activeTab === item.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              backgroundColor: activeTab === item.id ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            {item.icon}
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="bottom-menu" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
         <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <Settings size={20} />
            <span style={{ fontWeight: 500 }}>Settings</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}>
            <Info size={20} />
            <span style={{ fontWeight: 500 }}>About</span>
          </div>
      </div>
    </div>
  );
};

export default Sidebar;
