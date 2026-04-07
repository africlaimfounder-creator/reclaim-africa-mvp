import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';

const MyClaims = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = () => {
    if (user) {
      const userClaims = JSON.parse(localStorage.getItem(`claims_${user.id}`) || '[]');
      setClaims(userClaims);
      setLoading(false);
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-12">
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}
            data-testid="my-claims-page-title"
          >
            My Claims
          </h1>
          <p className="text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Track all your submitted claims in one place.
          </p>
        </div>

        {loading ? (
          <div className="text-[#A3A099] text-center py-12">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div
            className="rounded-2xl p-12 border text-center"
            style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
          >
            <FileText size={48} className="mx-auto mb-4" style={{ color: '#A3A099' }} />
            <p className="text-[#A3A099] mb-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
              You haven't submitted any claims yet.
            </p>
            <button
              onClick={() => navigate('/new-claim')}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95"
              style={{
                backgroundColor: '#D4AF37',
                color: '#0A0908',
                fontFamily: 'Manrope, sans-serif'
              }}
            >
              Start Your First Claim
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {claims.map((claim, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 border"
                style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
                data-testid={`my-claim-card-${index}`}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3
                      className="text-xl font-bold text-white mb-4"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {claim.asset_type}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>Company:</span>
                        <span className="text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {claim.company_name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>State:</span>
                        <span className="text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>{claim.state}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>Service Tier:</span>
                        <span className="text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {claim.service_tier}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <span
                        className="inline-block px-4 py-2 rounded-lg font-semibold mb-4"
                        style={{
                          backgroundColor: `${getStatusColor(claim.status)}20`,
                          color: getStatusColor(claim.status),
                          fontFamily: 'Manrope, sans-serif'
                        }}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <div className="text-sm text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      Submitted: {new Date(claim.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClaims;
