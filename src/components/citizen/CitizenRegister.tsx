import React, { useState } from 'react';
import { JHARKHAND_DISTRICTS } from '../../mock/data';
import { useApp } from '../../context/AppContext';
import './CitizenRegister.css';

interface CitizenRegisterProps {
  onLoginClick?: () => void;
  onRegisterSuccess?: () => void;
}

export const CitizenRegister: React.FC<CitizenRegisterProps> = ({
  onLoginClick,
  onRegisterSuccess,
}) => {
  const { showToast, switchRole, setCurrentView } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    state: 'Jharkhand',
    district: 'Ranchi',
    cityTownVillage: '',
    pinCode: '',
    digilockerCheck: false,
    aadhaar: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [digilockerVerified, setDigilockerVerified] = useState(false);

  const INDIAN_STATES = [
    'Jharkhand',
    'Bihar',
    'West Bengal',
    'Odisha',
    'Chhattisgarh',
    'Uttar Pradesh',
    'Other State / UT',
  ];

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleDigiLockerVerify = () => {
    const cleanAadhaar = formData.aadhaar.replace(/\D/g, '');
    if (cleanAadhaar.length === 12) {
      setDigilockerVerified(true);
      showToast(
        'success',
        'DigiLocker Verified',
        'Aadhaar identity successfully verified via DigiLocker Sandbox.'
      );
    } else {
      showToast(
        'info',
        'DigiLocker Sandbox',
        'Please enter a valid 12-digit Aadhaar number to verify with DigiLocker.'
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Valid Email Address is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.cityTownVillage.trim()) {
      newErrors.cityTownVillage = 'City / Town / Village is required';
    }
    if (!formData.pinCode.trim() || !/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = 'Enter 6-digit PIN code';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to Terms & Conditions';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        'warning',
        'Form Validation Failed',
        'Please correct highlighted fields before submitting.'
      );
      return;
    }

    showToast(
      'success',
      'Account Created Successfully',
      `Welcome ${formData.fullName}! Your Citizen Account has been created.`
    );

    if (onRegisterSuccess) {
      onRegisterSuccess();
    } else {
      switchRole('citizen');
      setCurrentView('citizen-dashboard');
    }
  };

  return (
    <div className="citizen-register-card">
      {/* Header */}
      <div className="login-header">
        <div className="emblem-wrapper">
          <img
            src="/jharkhand-emblem.png"
            alt="Government of Jharkhand"
            className="jharkhand-emblem"
          />
        </div>
        <div className="government-name">Government of Jharkhand</div>
        <h1>
          <span>CREATE CITIZEN</span>
          <strong>ACCOUNT</strong>
        </h1>
        <div className="gold-divider">
          <span>◆</span>
        </div>
        <p className="tagline">Societal Innovation Collaboration Portal</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        {/* Form Fields Grid */}
        <div className="form-grid">
          {/* 1. Full Name */}
          <div className="form-field full-width">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar Soren"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* 2. Mobile Number */}
          <div className="form-field">
            <label>
              Mobile Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, ''))}
            />
            {errors.mobile && <span className="field-error">{errors.mobile}</span>}
          </div>

          {/* 3. Email Address */}
          <div className="form-field">
            <label>
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* 4. Password */}
          <div className="form-field">
            <label>
              Password <span className="req">*</span>
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* 5. Confirm Password */}
          <div className="form-field">
            <label>
              Confirm Password <span className="req">*</span>
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
          </div>

          {/* 6. State */}
          <div className="form-field">
            <label>
              State <span className="req">*</span>
            </label>
            <input
              type="text"
              value="Jharkhand"
              readOnly
              disabled
            />
          </div>

          {/* 7. District */}
          <div className="form-field">
            <label>
              District <span className="req">*</span>
            </label>
            <select
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
            >
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 8. City / Town / Village */}
          <div className="form-field">
            <label>
              City / Town / Village <span className="req">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter city or village"
              value={formData.cityTownVillage}
              onChange={(e) => handleChange('cityTownVillage', e.target.value)}
            />
            {errors.cityTownVillage && (
              <span className="field-error">{errors.cityTownVillage}</span>
            )}
          </div>

          {/* 9. PIN Code */}
          <div className="form-field">
            <label>
              PIN Code <span className="req">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="6-digit PIN"
              value={formData.pinCode}
              onChange={(e) =>
                handleChange('pinCode', e.target.value.replace(/\D/g, ''))
              }
            />
            {errors.pinCode && <span className="field-error">{errors.pinCode}</span>}
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider">
          <span>◆</span>
        </div>

        {/* Identity Verification Section */}
        <div className="verification-section">
          <div className="section-title">IDENTITY VERIFICATION</div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.digilockerCheck}
              onChange={(e) => handleChange('digilockerCheck', e.target.checked)}
            />
            <span>Verify using DigiLocker</span>
          </label>

          <div className="digilocker-box">
            <div className="form-field">
              <label>Aadhaar Number</label>
              <input
                type="text"
                maxLength={14}
                placeholder="XXXX XXXX XXXX"
                value={formData.aadhaar}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
                  const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                  handleChange('aadhaar', formatted);
                }}
              />
            </div>

            <button
              type="button"
              className="digilocker-button"
              onClick={handleDigiLockerVerify}
            >
              <span>
                {digilockerVerified
                  ? '✓ Verified with DigiLocker'
                  : 'Verify with DigiLocker'}
              </span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider">
          <span>◆</span>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="terms-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
            />
            <span>I agree to Terms & Conditions</span>
          </label>
          {errors.agreeTerms && <div className="field-error">{errors.agreeTerms}</div>}
        </div>

        {/* Primary Submit Button */}
        <button type="submit" className="gold-button register-button">
          <span>CREATE ACCOUNT</span>
          <span className="button-arrow">→</span>
        </button>

        {/* Heritage Line */}
        <div className="heritage-line">✦ ─── ✧ ─── ✦ ─── ✧ ─── ✦</div>

        {/* Bottom Login Link */}
        <div className="register-text">
          Already have an account?{' '}
          <button type="button" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default CitizenRegister;
