import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('employee_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    } else {
      // Initialize default profile
      const defaultProfile = {
        personalInfo: {
          firstName: 'Krishna',
          lastName: 'Patel',
          email: 'patel.bk@company.com',
          phone: '+1-555-0123',
          dateOfBirth: '1990-05-15',
          address: '123 Main St, City, State 12345',
          profilePicture: null
        },
        employmentInfo: {
          employeeId: 'EMP001',
          department: 'Engineering',
          position: 'Software Developer',
          manager: 'Jane Smith',
          hireDate: '2023-01-15',
          workLocation: 'San Francisco Office'
        },
        emergencyContacts: [
          {
            id: '1',
            name: 'Krishna Patel',
            relationship: 'Spouse',
            phone: '+1-555-0124',
            email: 'jane.doe@email.com'
          }
        ],
        documents: []
      };
      setUserProfile(defaultProfile);
      localStorage.setItem('employee_profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const updateProfile = (updates) => {
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    localStorage.setItem('employee_profile', JSON.stringify(updatedProfile));
  };

  const uploadProfilePicture = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        const updatedProfile = {
          ...userProfile,
          personalInfo: {
            ...userProfile.personalInfo,
            profilePicture: imageDataUrl
          }
        };
        setUserProfile(updatedProfile);
        localStorage.setItem('employee_profile', JSON.stringify(updatedProfile));
        resolve(imageDataUrl);
      };
      reader.readAsDataURL(file);
    });
  };

  const addEmergencyContact = (contact) => {
    const newContact = {
      ...contact,
      id: Date.now().toString()
    };
    const updatedProfile = {
      ...userProfile,
      emergencyContacts: [...userProfile.emergencyContacts, newContact]
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('employee_profile', JSON.stringify(updatedProfile));
  };

  const updateEmergencyContact = (contactId, updates) => {
    const updatedContacts = userProfile.emergencyContacts.map(contact =>
      contact.id === contactId ? { ...contact, ...updates } : contact
    );
    const updatedProfile = {
      ...userProfile,
      emergencyContacts: updatedContacts
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('employee_profile', JSON.stringify(updatedProfile));
  };

  const deleteEmergencyContact = (contactId) => {
    const updatedContacts = userProfile.emergencyContacts.filter(
      contact => contact.id !== contactId
    );
    const updatedProfile = {
      ...userProfile,
      emergencyContacts: updatedContacts
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('employee_profile', JSON.stringify(updatedProfile));
  };

  const value = {
    userProfile,
    updateProfile,
    uploadProfilePicture,
    addEmergencyContact,
    updateEmergencyContact,
    deleteEmergencyContact
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};