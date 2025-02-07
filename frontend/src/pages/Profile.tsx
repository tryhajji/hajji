import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
}

const Profile = () => {
  const { user } = useAppContext();
  const [activeSection, setActiveSection] = useState('personal');
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    passportNumber: string;
    passportExpiry: string;
    madhab: string;
    hajjCompleted: boolean;
    umrahCompleted: boolean;
    specialNeeds: string;
    dietaryRestrictions: string;
    prayerAccommodations: string;
    preferredAirline: string;
    seatPreference: string;
    mealPreference: string;
    accommodationPreference: string;
    roomType: string;
    groupSize: string;
    budgetRange: string;
    language: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      pushNotifications: boolean;
    };
    newsletterSubscription: boolean;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
    emergencyContactEmail: string;
    identityDocument: File | null;
    passportCopy: File | null;
    vaccinationRecord: File | null;
    medicalCertificate: File | null;
  }>({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    madhab: '',
    hajjCompleted: false,
    umrahCompleted: false,
    specialNeeds: '',
    dietaryRestrictions: '',
    prayerAccommodations: '',
    preferredAirline: '',
    seatPreference: '',
    mealPreference: '',
    accommodationPreference: '',
    roomType: '',
    groupSize: '',
    budgetRange: '',
    language: '',
    notificationPreferences: {
      email: true,
      sms: true,
      pushNotifications: true
    },
    newsletterSubscription: true,
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    identityDocument: null,
    passportCopy: null,
    vaccinationRecord: null,
    medicalCertificate: null
  });

  const sections: ProfileSection[] = [
    { id: 'personal', title: 'Personal Information', icon: 'user' },
    { id: 'religious', title: 'Religious Preferences', icon: 'pray' },
    { id: 'travel', title: 'Travel Preferences', icon: 'plane' },
    { id: 'communication', title: 'Communication', icon: 'bell' },
    { id: 'emergency', title: 'Emergency Contacts', icon: 'phone' },
    { id: 'documents', title: 'Documents', icon: 'file' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile data:', formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-1">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    activeSection === section.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <i className={`fas fa-${section.icon} mr-3`}></i>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white shadow rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                {activeSection === 'personal' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Religious Preferences Section */}
                {activeSection === 'religious' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Religious Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Madhab</label>
                        <select
                          name="madhab"
                          value={formData.madhab}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Select Madhab</option>
                          <option value="hanafi">Hanafi</option>
                          <option value="maliki">Maliki</option>
                          <option value="shafii">Shafi'i</option>
                          <option value="hanbali">Hanbali</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Special Needs</label>
                        <textarea
                          name="specialNeeds"
                          value={formData.specialNeeds}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dietary Restrictions</label>
                        <input
                          type="text"
                          name="dietaryRestrictions"
                          value={formData.dietaryRestrictions}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Prayer Accommodations</label>
                        <input
                          type="text"
                          name="prayerAccommodations"
                          value={formData.prayerAccommodations}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Travel Preferences Section */}
                {activeSection === 'travel' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Travel Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Airline</label>
                        <input
                          type="text"
                          name="preferredAirline"
                          value={formData.preferredAirline}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Accommodation Preference</label>
                        <select
                          name="accommodationPreference"
                          value={formData.accommodationPreference}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Select Preference</option>
                          <option value="budget">Budget</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Room Type</label>
                        <select
                          name="roomType"
                          value={formData.roomType}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Select Room Type</option>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                          <option value="quad">Quad</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                        <select
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Select Budget Range</option>
                          <option value="economy">Economy ($3,000 - $5,000)</option>
                          <option value="standard">Standard ($5,000 - $8,000)</option>
                          <option value="premium">Premium ($8,000 - $12,000)</option>
                          <option value="luxury">Luxury ($12,000+)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Communication Preferences Section */}
                {activeSection === 'communication' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Communication Preferences</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="">Select Language</option>
                          <option value="english">English</option>
                          <option value="arabic">Arabic</option>
                          <option value="urdu">Urdu</option>
                          <option value="indonesian">Indonesian</option>
                          <option value="turkish">Turkish</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Notification Preferences</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="notificationPreferences.email"
                              checked={formData.notificationPreferences.email}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Email Notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="notificationPreferences.sms"
                              checked={formData.notificationPreferences.sms}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">SMS Notifications</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="notificationPreferences.pushNotifications"
                              checked={formData.notificationPreferences.pushNotifications}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Push Notifications</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emergency Contact Section */}
                {activeSection === 'emergency' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Emergency Contact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Relationship</label>
                        <input
                          type="text"
                          name="emergencyContactRelation"
                          value={formData.emergencyContactRelation}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                        <input
                          type="email"
                          name="emergencyContactEmail"
                          value={formData.emergencyContactEmail}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Documents Section */}
                {activeSection === 'documents' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Identity Document</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'identityDocument')}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-50 file:text-emerald-700
                            hover:file:bg-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Passport Copy</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'passportCopy')}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-50 file:text-emerald-700
                            hover:file:bg-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Vaccination Record</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'vaccinationRecord')}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-50 file:text-emerald-700
                            hover:file:bg-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Medical Certificate</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, 'medicalCertificate')}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-emerald-50 file:text-emerald-700
                            hover:file:bg-emerald-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 