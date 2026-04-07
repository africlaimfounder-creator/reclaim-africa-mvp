import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import { ArrowLeft, ArrowRight, Check, Lock, AlertCircle } from 'lucide-react';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
];

const ASSET_TYPES = [
  { name: 'Unclaimed Dividends', available: true },
  { name: 'Dormant Bank Accounts', available: false },
  { name: 'Insurance Payouts', available: false },
  { name: 'Pension Funds', available: false },
  { name: 'Unclaimed Salaries', available: false },
  { name: 'Mobile Money', available: false },
  { name: 'Inheritance Assets', available: false },
  { name: 'Government Bonds', available: false },
  { name: 'Cooperative Funds', available: false },
  { name: 'Investment Accounts', available: false },
  { name: 'Tax Refunds', available: false },
  { name: 'Property Proceeds', available: false }
];

const CLAIMING_FOR_OPTIONS = [
  'I am the shareholder',
  'I am claiming for a deceased family member and we are all in agreement',
  'I am claiming for a deceased family member but there is a dispute among beneficiaries'
];

const DOCUMENT_OPTIONS = [
  'Share certificate',
  'Death certificate',
  'Will or letter of administration',
  'Court order',
  'National ID or passport of claimant',
  'None of the above'
];

const SERVICE_TIERS = [
  {
    name: 'Guided Self Recovery',
    description: 'We show you exactly which office to visit, who to meet and what documents to prepare. You do the physical work, we provide the roadmap.',
    fee: '10% of recovered amount',
    minimum: '5000 naira',
    available: true
  },
  {
    name: 'Partial Manual Recovery',
    description: 'We act on your behalf using power of attorney. We physically submit your documents and interface with registrars directly. All travel expenses, court affidavit costs and filing fees are covered by you the client, with your approval before any expense is made.',
    fee: '15% of recovered amount',
    minimum: '',
    available: true
  },
  {
    name: 'Full Automated Recovery',
    description: 'When we establish formal connections with the SEC, banks and registrars, everything will be processed online with no physical visits required. Join our waitlist to be notified when this launches.',
    fee: '20% of recovered amount',
    minimum: '',
    available: false
  },
  {
    name: 'I am not sure yet, please advise me',
    description: '',
    fee: '',
    minimum: '',
    available: true
  }
];

const NewClaim = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_type: '',
    claiming_for: '',
    documents: [],
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    state: '',
    company_name: '',
    estimated_shares: '',
    estimated_value: '',
    service_tier: ''
  });

  const totalSteps = 6;

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.asset_type !== '';
      case 2:
        return formData.claiming_for !== '';
      case 3:
        return formData.documents.length > 0;
      case 4:
        return formData.full_name && formData.phone && formData.email && formData.state && formData.company_name;
      case 5:
        return formData.service_tier !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setError('');
      if (step < totalSteps) {
        setStep(step + 1);
      }
    } else {
      setError('Please complete all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError('');
      setStep(step - 1);
    }
  };

  const handleDocumentToggle = (doc) => {
    if (formData.documents.includes(doc)) {
      setFormData({ ...formData, documents: formData.documents.filter((d) => d !== doc) });
    } else {
      setFormData({ ...formData, documents: [...formData.documents, doc] });
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Create new claim
      const newClaim = {
        ...formData,
        id: Date.now().toString(),
        status: 'Submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to localStorage
      const userClaims = JSON.parse(localStorage.getItem(`claims_${user.id}`) || '[]');
      userClaims.push(newClaim);
      localStorage.setItem(`claims_${user.id}`, JSON.stringify(userClaims));

      // Create notification
      const notifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        title: 'Claim Submitted Successfully',
        message: `Your claim for ${formData.asset_type} has been submitted. Our team will review it within 48 hours.`,
        type: 'claim_submitted',
        read: false,
        created_at: new Date().toISOString()
      });
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));

      setStep(6);
    } catch (e) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProgressBar = () => {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                  style={{
                    backgroundColor: step >= s ? '#D4AF37' : '#2B2823',
                    color: step >= s ? '#0A0908' : '#A3A099'
                  }}
                >
                  {step > s ? <Check size={20} /> : s}
                </div>
                <span
                  className="text-xs mt-2 hidden md:block"
                  style={{ color: step >= s ? '#D4AF37' : '#A3A099', fontFamily: 'Manrope, sans-serif' }}
                >
                  Step {s}
                </span>
              </div>
              {s < 5 && (
                <div
                  className="flex-1 h-1 mx-2"
                  style={{ backgroundColor: step > s ? '#D4AF37' : '#2B2823' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="step1-title">
        What type of asset are you claiming?
      </h2>
      <p className="text-[#A3A099] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Select the type of financial asset you want to recover.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ASSET_TYPES.map((asset, index) => (
          <button
            key={index}
            disabled={!asset.available}
            onClick={() => setFormData({ ...formData, asset_type: asset.name })}
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
              asset.available ? 'hover:border-[#D4AF37] active:scale-95' : 'cursor-not-allowed opacity-50'
            }`}
            style={{
              backgroundColor: formData.asset_type === asset.name ? 'rgba(212, 175, 55, 0.1)' : '#12100E',
              borderColor: formData.asset_type === asset.name ? '#D4AF37' : '#2B2823'
            }}
            data-testid={`asset-type-${index}`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-white font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {asset.name}
              </span>
              {!asset.available && <Lock size={18} style={{ color: '#A3A099' }} />}
            </div>
            {asset.available ? (
              <span className="text-sm" style={{ color: '#22C55E', fontFamily: 'Manrope, sans-serif' }}>
                Available now
              </span>
            ) : (
              <span className="text-sm text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Coming soon
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: '#12100E', borderColor: '#2B2823' }}>
        <p className="text-[#A3A099] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <strong className="text-white">Note:</strong> We are expanding to cover all 12 asset types. Join our waitlist and we will notify you when your asset type is available.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="step2-title">
        Who is claiming?
      </h2>
      <p className="text-[#A3A099] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Select your relationship to the asset.
      </p>

      <div className="space-y-4">
        {CLAIMING_FOR_OPTIONS.map((option, index) => (
          <button
            key={index}
            onClick={() => setFormData({ ...formData, claiming_for: option })}
            className="w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:border-[#D4AF37] active:scale-95"
            style={{
              backgroundColor: formData.claiming_for === option ? 'rgba(212, 175, 55, 0.1)' : '#12100E',
              borderColor: formData.claiming_for === option ? '#D4AF37' : '#2B2823'
            }}
            data-testid={`claiming-for-${index}`}
          >
            <span className="text-white font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="step3-title">
        What documents do you currently have?
      </h2>
      <p className="text-[#A3A099] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Select all that apply. Don't worry if you're missing documents—we'll guide you.
      </p>

      <div className="space-y-4">
        {DOCUMENT_OPTIONS.map((doc, index) => (
          <button
            key={index}
            onClick={() => handleDocumentToggle(doc)}
            className="w-full p-6 rounded-xl border-2 transition-all duration-300 text-left hover:border-[#D4AF37] active:scale-95 flex items-center gap-4"
            style={{
              backgroundColor: formData.documents.includes(doc) ? 'rgba(212, 175, 55, 0.1)' : '#12100E',
              borderColor: formData.documents.includes(doc) ? '#D4AF37' : '#2B2823'
            }}
            data-testid={`document-${index}`}
          >
            <div
              className="w-6 h-6 rounded border-2 flex items-center justify-center"
              style={{
                backgroundColor: formData.documents.includes(doc) ? '#D4AF37' : 'transparent',
                borderColor: formData.documents.includes(doc) ? '#D4AF37' : '#2B2823'
              }}
            >
              {formData.documents.includes(doc) && <Check size={16} style={{ color: '#0A0908' }} />}
            </div>
            <span className="text-white font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {doc}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="step4-title">
        Your Details
      </h2>
      <p className="text-[#A3A099] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Provide your information to proceed with the claim.
      </p>

      <div className="space-y-5 max-w-2xl">
        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-fullname-input"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-phone-input"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-email-input"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            State of Residence *
          </label>
          <select
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: formData.state ? '#FFFFFF' : '#A3A099',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-state-select"
          >
            <option value="">Select your state</option>
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state} style={{ backgroundColor: '#1A1815', color: '#FFFFFF' }}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Name of company shares were held in *
          </label>
          <input
            type="text"
            required
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-company-input"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Estimated number of shares (if known)
          </label>
          <input
            type="text"
            value={formData.estimated_shares}
            onChange={(e) => setFormData({ ...formData, estimated_shares: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-shares-input"
          />
        </div>

        <div>
          <label className="block text-white mb-2 text-sm font-medium" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Estimated value (if known)
          </label>
          <input
            type="text"
            value={formData.estimated_value}
            onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none transition-all duration-300"
            style={{
              backgroundColor: '#1A1815',
              borderColor: '#2B2823',
              color: '#FFFFFF',
              fontFamily: 'Manrope, sans-serif'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#D4AF37')}
            onBlur={(e) => (e.target.style.borderColor = '#2B2823')}
            data-testid="step4-value-input"
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="step5-title">
        Which service tier?
      </h2>
      <p className="text-[#A3A099] mb-8" style={{ fontFamily: 'Manrope, sans-serif' }}>
        Choose the service level that best suits your needs.
      </p>

      <div className="space-y-6">
        {SERVICE_TIERS.map((tier, index) => (
          <button
            key={index}
            disabled={!tier.available}
            onClick={() => setFormData({ ...formData, service_tier: tier.name })}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
              tier.available ? 'hover:border-[#D4AF37] active:scale-95' : 'cursor-not-allowed opacity-50'
            }`}
            style={{
              backgroundColor: formData.service_tier === tier.name ? 'rgba(212, 175, 55, 0.1)' : '#12100E',
              borderColor: formData.service_tier === tier.name ? '#D4AF37' : '#2B2823'
            }}
            data-testid={`service-tier-${index}`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {tier.name}
              </h3>
              {!tier.available && <Lock size={20} style={{ color: '#A3A099' }} />}
            </div>
            {tier.description && (
              <p className="text-[#A3A099] text-sm mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>
                {tier.description}
              </p>
            )}
            {tier.fee && (
              <div className="flex gap-4 text-sm">
                <span className="text-white font-semibold" style={{ fontFamily: 'Manrope, sans-serif' }}>
                  Success fee: {tier.fee}
                </span>
                {tier.minimum && (
                  <span className="text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    Minimum: {tier.minimum}
                  </span>
                )}
              </div>
            )}
            {!tier.available && (
              <p className="text-sm mt-3" style={{ color: '#A3A099', fontFamily: 'Manrope, sans-serif' }}>
                Join our waitlist to be notified when this launches.
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="text-center max-w-2xl mx-auto">
      <div className="mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: '#D4AF37' }}
        >
          <Check size={40} style={{ color: '#0A0908' }} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }} data-testid="confirmation-title">
          Thank You
        </h2>
        <div className="space-y-4 text-lg text-[#A3A099]" style={{ fontFamily: 'Manrope, sans-serif' }}>
          <p>Reclaim Africa has received your claim request.</p>
          <p>Our team will review your case and contact you within 48 hours.</p>
          <p className="text-white font-semibold">There is no upfront cost.</p>
          <p className="text-[#D4AF37] font-semibold">We only get paid when you get paid.</p>
          <p className="text-white font-semibold">Welcome to Reclaim Africa.</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center justify-center gap-2 mx-auto"
        style={{
          backgroundColor: '#D4AF37',
          color: '#0A0908',
          fontFamily: 'Manrope, sans-serif'
        }}
        data-testid="go-to-dashboard-btn"
      >
        Go to Dashboard
        <ArrowRight size={20} />
      </button>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#0A0908', minHeight: '100vh' }}>
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {step < 6 && renderProgressBar()}

        {error && (
          <div
            className="max-w-4xl mx-auto mb-8 p-4 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444' }}
            data-testid="claim-error"
          >
            <AlertCircle size={20} style={{ color: '#EF4444' }} />
            <span className="text-sm" style={{ color: '#EF4444' }}>
              {error}
            </span>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}

          {step < 6 && (
            <div className="flex justify-between mt-12">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-[#2B2823] active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'transparent',
                  color: '#A3A099',
                  border: '1px solid #2B2823',
                  fontFamily: 'Manrope, sans-serif'
                }}
                data-testid="back-btn"
              >
                <ArrowLeft size={20} />
                Back
              </button>

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center gap-2"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0A0908',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                  data-testid="next-btn"
                >
                  Next
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canProceed()}
                  className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: '#D4AF37',
                    color: '#0A0908',
                    fontFamily: 'Manrope, sans-serif'
                  }}
                  data-testid="submit-claim-btn"
                >
                  {loading ? 'Submitting...' : 'Submit Claim'}
                  {!loading && <ArrowRight size={20} />}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewClaim;
