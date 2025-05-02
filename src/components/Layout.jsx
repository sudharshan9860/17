import React, { useContext, useState, useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faChartLine, 
  faGraduationCap,
  faCalendarAlt,
  faClock,
  faBook,
  faAward,
  faBell,
  faSearch,
  faUser,
  faQuestionCircle 
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';
import { AuthContext } from './AuthContext';
import NotificationDropdown from './NotificationDropdown';
import SoundConfigModal from './SoundConfigModal';
import FixedFooter from './FixedFooter';
import { soundManager } from '../utils/SoundManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const { username, logout } = useContext(AuthContext);
  
  // Sound configuration state
  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.isSoundEnabled);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to add shadow to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationLinks = [
    { path: '/student-dash', label: 'Student Dash' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/progress-dashboard', label: 'Progress' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/quests', label: 'Quests' }
  ];

  const sidebarMenuItems = [
    { path: '/my-courses', label: 'My Courses', icon: faBook },
    { path: '/performance', label: 'Performance', icon: faChartLine },
    { path: '/schedule', label: 'Schedule', icon: faCalendarAlt },
    { path: '/achievements', label: 'Achievements', icon: faAward },
    { path: '/study-history', label: 'Study History', icon: faClock },
    { path: '/resources', label: 'Resources', icon: faGraduationCap }
  ];

  return (
    <div id="main-content" className="d-flex flex-column min-vh-100">
      {/* Top Header */}
      <header className={`top-header ${isScrolled ? 'header-shadow' : ''}`}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div className="brand-name animate-on-load">ORCALEX EDUCATION</div>
            
            <div className="search-section">
              <div className="search-bar">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Search for lessons, quizzes..." />
              </div>
            </div>
            
            <div className="user-section">
              <div className="notification-icon me-3">
                <FontAwesomeIcon icon={faBell} />
              </div>
              <div className="user-avatar d-flex align-items-center">
                <div className="avatar-circle me-2">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <span className="user-role">Student</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <div className="main-navigation">
        <div className="container-fluid">
          <Nav className="main-nav">
            {navigationLinks.map((link, index) => (
              <Nav.Link
                key={link.path}
                className={`nav-link ${currentLocation.pathname === link.path ? 'active' : ''}`}
                onClick={() => navigate(link.path)}
                style={{'--index': index}}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-welcome">
            <div className="avatar-circle">
              <FontAwesomeIcon icon={faGraduationCap} />
            </div>
            <div className="welcome-text">
              <div>Welcome back,</div>
              <div className="user-name">{username || 'Student'}</div>
            </div>
          </div>
          
          <div className="sidebar-menu">
            {sidebarMenuItems.map((item, index) => (
              <div 
                key={index}
                className={`menu-item ${currentLocation.pathname === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <div className="menu-icon">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {children}
        </div>
      </div>

      {/* Fixed Footer */}
      <FixedFooter />

      {/* Sound Configuration Modal */}
      <SoundConfigModal 
        show={showSoundConfig} 
        onHide={() => setShowSoundConfig(false)} 
      />
    </div>
  );
};

export default Layout;