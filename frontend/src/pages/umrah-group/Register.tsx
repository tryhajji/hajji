import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const UmrahGroupRegister = () => {
  const navigate = useNavigate();
  const { register } = useAppContext();
  const [formData, setFormData] = useState({
    groupName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    licenseNumber: '',
    registrationNumber: '',
    taxNumber: '',
    website: '',
    yearEstablished: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    description: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    numberOfMembers: '',
    languages: [] as string[],
    specialties: [] as string[],
    insuranceProvider: '',
    insurancePolicyNumber: '',
    bankName: '',
    bankAccountNumber: '',
    swiftCode: '',
  });

  const [error, setError] = useState('');

  const languageOptions = [
    'Arabic', 'English', 'Urdu', 'Turkish', 'Malay', 'Indonesian',
    'French', 'Persian', 'Bengali', 'Hindi'
  ];

  const specialtyOptions = [
    'Family Groups', 'VIP Services', 'Senior Groups', 'First-Time Pilgrims',
    'Women-Only Groups', 'Educational Groups', 'Extended Stay', 'Budget Groups',
    'Disabled Access', 'Medical Support'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register({
        ...formData,
        role: 'umrah_group',
        status: 'pending',
        registrationDate: new Date().toISOString(),
      });
      navigate('/registration-pending');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register Umrah Group
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide detailed information about your Umrah group
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                    Group Name *
                  </label>
                  <input
                    id="groupName"
                    name="groupName"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.groupName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700">
                    Year Established *
                  </label>
                  <input
                    id="yearEstablished"
                    name="yearEstablished"
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.yearEstablished}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="numberOfMembers" className="block text-sm font-medium text-gray-700">
                    Number of Members *
                  </label>
                  <input
                    id="numberOfMembers"
                    name="numberOfMembers"
                    type="number"
                    required
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.numberOfMembers}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Business Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Primary Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="alternativePhoneNumber" className="block text-sm font-medium text-gray-700">
                    Alternative Phone Number
                  </label>
                  <input
                    id="alternativePhoneNumber"
                    name="alternativePhoneNumber"
                    type="tel"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.alternativePhoneNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Legal Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    License Number *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                    Registration Number *
                  </label>
                  <input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700">
                    Tax Number
                  </label>
                  <input
                    id="taxNumber"
                    name="taxNumber"
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.taxNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">
                    Insurance Provider *
                  </label>
                  <input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700">
                    Insurance Policy Number *
                  </label>
                  <input
                    id="insurancePolicyNumber"
                    name="insurancePolicyNumber"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.insurancePolicyNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State/Province *
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    Postal Code *
                  </label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Leader Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Leader Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="leaderName" className="block text-sm font-medium text-gray-700">
                    Leader Name *
                  </label>
                  <input
                    id="leaderName"
                    name="leaderName"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.leaderName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="leaderEmail" className="block text-sm font-medium text-gray-700">
                    Leader Email *
                  </label>
                  <input
                    id="leaderEmail"
                    name="leaderEmail"
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.leaderEmail}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="leaderPhone" className="block text-sm font-medium text-gray-700">
                    Leader Phone *
                  </label>
                  <input
                    id="leaderPhone"
                    name="leaderPhone"
                    type="tel"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.leaderPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Banking Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Banking Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name *
                  </label>
                  <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="bankAccountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number *
                  </label>
                  <input
                    id="bankAccountNumber"
                    name="bankAccountNumber"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-700">
                    SWIFT/BIC Code *
                  </label>
                  <input
                    id="swiftCode"
                    name="swiftCode"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.swiftCode}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Services and Languages */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services and Languages</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                    Languages Supported *
                  </label>
                  <select
                    id="languages"
                    name="languages"
                    multiple
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.languages}
                    onChange={handleMultiSelect}
                  >
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                    Group Specialties *
                  </label>
                  <select
                    id="specialties"
                    name="specialties"
                    multiple
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.specialties}
                    onChange={handleMultiSelect}
                  >
                    {specialtyOptions.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Group Description</h3>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Detailed Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed description of your group, including your experience, services, and what makes your group unique..."
                />
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Register Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UmrahGroupRegister;