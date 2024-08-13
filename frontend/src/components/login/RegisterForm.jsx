import React, { useState } from 'react';

const RegisterForm = ({ switchForm, handleSubmit }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={(e) => handleSubmit(e, formData)}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
        <label htmlFor="password">Password:</label>
        <div className="password-container">
          <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchForm(); }}>Login</a></p>
    </div>
  );
};

export default RegisterForm;