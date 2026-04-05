import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const STATUS_OPTIONS = ['Submitted', 'Under Review', 'Completed'];

const Admin = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingClaim, setUpdatingClaim] = useState(null);

  useEffect(() => {
    fetchAllClaims();
  }, []);

  const fetchAllClaims = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/claims`, { withCredentials: true });
      setClaims(data);
    } catch (e) {
      setError('Failed to fetch claims. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    setUpdatingClaim(claimId);
    try {
      await axios.patch(
        `${API_URL}/api/admin/claims/${claimId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setClaims(claims.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c)));
    } catch (e) {
      setError('Failed to update claim status.');
    } finally {
      setUpdatingClaim(null);
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
            data-testid="admin-title"
          >
            Admin Panel
          </h1>
          <p className="text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Manage all claim submissions.
          </p>
        </div>

        {error && (
          <div
            className="mb-8 p-4 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444' }}
            data-testid="admin-error"
          >
            <AlertCircle size={20} style={{ color: '#EF4444' }} />
            <span className="text-sm" style={{ color: '#EF4444' }}>
              {error}
            </span>
          </div>
        )}

        {loading ? (
          <div className="text-[#A3A099] text-center py-12">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div
            className="rounded-2xl p-12 border text-center"
            style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}
          >
            <p className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              No claims submitted yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="claims-table">
              <thead>
                <tr style={{ borderBottom: '1px solid #2B2823' }}>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    User
                  </th>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    Asset Type
                  </th>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    Company
                  </th>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    Service Tier
                  </th>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 text-white font-bold"
                    style={{ fontFamily: 'Outfit, sans-serif', backgroundColor: '#12100E' }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr
                    key={claim.id}
                    style={{ borderBottom: '1px solid #2B2823' }}
                    data-testid={`admin-claim-row-${index}`}
                  >
                    <td className="p-4">
                      <div>
                        <div className="text-white font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {claim.user_full_name}
                        </div>
                        <div className="text-sm text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                          {claim.user_email}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {claim.asset_type}
                    </td>
                    <td className="p-4 text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {claim.company_name}
                    </td>
                    <td className="p-4 text-[#A3A099] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {claim.service_tier}
                    </td>
                    <td className="p-4">
                      <select
                        value={claim.status}
                        onChange={(e) => updateClaimStatus(claim.id, e.target.value)}
                        disabled={updatingClaim === claim.id}
                        className="px-3 py-2 rounded-lg border outline-none transition-all duration-300"
                        style={{
                          backgroundColor: '#1A1815',
                          borderColor: '#2B2823',
                          color: '#FFFFFF',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        data-testid={`status-select-${index}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status} style={{ backgroundColor: '#1A1815', color: '#FFFFFF' }}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-[#A3A099] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {new Date(claim.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
