import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const initializeUsers = () => {
    const existingUsers = localStorage.getItem('campusUsers');
    if (!existingUsers) {
      const defaultUsers = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@klh.edu.in',
          password: 'admin123',
          role: 'admin',
          joinedDate: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Dr. Rajesh Kumar',
          email: 'faculty@klh.edu.in',
          password: 'faculty123',
          role: 'faculty',
          department: 'Computer Science',
          joinedDate: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Aarushi Chakraborty',
          email: 'student@klh.edu.in',
          password: 'student123',
          role: 'student',
          rollNumber: '2023CS001',
          year: '2nd Year',
          joinedDate: new Date().toISOString()
        }
      ];
      localStorage.setItem('campusUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(existingUsers);
  };

  const login = (email, password, role) => {
    const users = initializeUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, message: 'Invalid credentials or role' };
  };

  const signup = (name, email, password, role, additionalData = {}) => {
    const users = initializeUsers();
    
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'User already exists with this email' };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role,
      ...additionalData,
      joinedDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('campusUsers', JSON.stringify(users));
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem('campusUsers') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('campusUsers', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
