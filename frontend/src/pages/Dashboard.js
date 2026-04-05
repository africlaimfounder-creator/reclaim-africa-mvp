import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import PushNotificationPrompt from '../components/PushNotificationPrompt';
import axios from 'axios';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/claims`, { withCredentials: true });
      setClaims(data);
    } catch (e) {
      console.error('Error fetching claims:', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Submitted':
        return <Clock size={20} style={{ color: '#D4AF37' }} />;
      case 'Under Review':
        return <AlertCircle size={20} style={{ color: '#3B82F6' }} />;
      case 'Completed':
        return <CheckCircle size={20} style={{ color: '#22C55E' }} />;
      default:
        return <FileText size={20} style={{ color: '#A3A099' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return '#D4AF37';
      case 'Under Review':
        return '#3B82F6';
      case 'Completed':
        return '#22C55E';
      default:
        return '#A3A099';
    }
  };

  return (
    <div style={{ backgroundColor: '#0A0908', minHeight: '100vh' }}>
      <Navigation />
      <PushNotificationPrompt />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="dashboard-welcome"
          >
            Welcome back, {user?.full_name}
          </h1>
          <p className="text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Track your claims and start recovering your unclaimed assets.
          </p>
        </div>

        <button
          onClick={() => navigate('/new-claim')}
          className="mb-12 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center gap-3"
          style={{
            backgroundColor: '#D4AF37',
            color: '#0A0908',
            fontFamily: 'Manrope, sans-serif'
          }}
          data-testid="start-new-claim-btn"
        >
          <Plus size={24} />
          Start a New Claim
        </button>

        <div>
          <h2
            className="text-2xl font-bold text-white mb-6"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="my-claims-title"
          >
            My Claims
          </h2>

          {loading ? (
            <div className="text-[#A3A099] text-center py-12">Loading claims...</div>
          ) : claims.length === 0 ? (
            <div
              className="rounded-2xl p-12 border text-center"
              style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
              data-testid="no-claims-message"
            >
              <FileText size={48} className="mx-auto mb-4" style={{ color: '#A3A099' }} />
              <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                You haven't submitted any claims yet. Start your first claim to recover your assets.
              </p>
            </div>
          ) : (
            <div className="grid gap-6" data-testid="claims-list">
              {claims.map((claim, index) => (
                <div
                  key={index}
                  className="rounded-2xl p-6 border transition-all duration-300 hover:border-[#D4AF37]"
                  style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
                  data-testid={`claim-card-${index}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold text-white mb-2"
                        style={{ fontFamily: 'Outfit, sans-serif' }}
                      >
                        {claim.asset_type}
                      </h3>
                      <p className="text-[#A3A099] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Company: {claim.company_name}
                      </p>
                      <p className="text-sm text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                        Service Tier: {claim.service_tier}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(claim.status)}
                      <span
                        className="px-4 py-2 rounded-lg font-semibold"
                        style={{
                          backgroundColor: `${getStatusColor(claim.status)}20`,
                          color: getStatusColor(claim.status),
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        data-testid={`claim-status-${index}`}
                      >
                        {claim.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
