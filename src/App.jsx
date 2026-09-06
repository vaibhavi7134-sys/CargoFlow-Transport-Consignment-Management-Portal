// App.jsx — CargoFlow Enterprise Logistics Portal
import { useState, useCallback, useEffect } from 'react';
import { getConsignments } from './utils/storage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import ConsignmentForm from './components/ConsignmentForm';
import ConsignmentTable from './components/ConsignmentTable';
import TrackOrder from './components/TrackOrder';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AiChat from './components/AiChat';
import './App.css';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [consignments, setConsignments] = useState(() => getConsignments());

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = document.getElementById('main-content');
    if (content) content.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  // Handle new consignment created
  const handleConsignmentAdded = useCallback((updatedList) => {
    setConsignments(updatedList);
  }, []);

  // Handle consignment deleted
  const handleConsignmentsChange = useCallback((updatedList) => {
    setConsignments(updatedList);
  }, []);

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        Skip to main content
      </a>

      <DashboardLayout
        activePage={activePage}
        onNavigate={handleNavigate}
        consignmentCount={consignments.length}
      >
        {activePage === 'dashboard' && (
          <Dashboard consignments={consignments} onNavigate={handleNavigate} />
        )}

        {activePage === 'booking' && (
          <ConsignmentForm onConsignmentAdded={handleConsignmentAdded} />
        )}

        {activePage === 'shipments' && (
          <ConsignmentTable
            consignments={consignments}
            onConsignmentsChange={handleConsignmentsChange}
            onNavigate={handleNavigate}
          />
        )}

        {activePage === 'track' && (
          <TrackOrder consignments={consignments} onNavigate={handleNavigate} />
        )}

        {activePage === 'about' && (
          <div className="info-page-container">
            <About />
            <Services />
            <Footer onNavigate={handleNavigate} />
          </div>
        )}

        {activePage === 'contact' && (
          <div className="info-page-container">
            <Contact />
            <Footer onNavigate={handleNavigate} />
          </div>
        )}
      </DashboardLayout>

      {/* Persistent AI Logistics Assistant */}
      <AiChat consignments={consignments} onNavigate={handleNavigate} />
    </>
  );
}
