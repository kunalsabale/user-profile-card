import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserProfileCard = () => {
  // State for user data
  const [user, setUser] = useState({
    name: "Kunal Sabale",
    email: "kunalsabale85@gmail.com",
    phone: "9762016975",
    profilePicture: "src/assets/user.png",
  });

  // State for edit mode and form data
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [errors, setErrors] = useState({});

  // Function to validate input fields
  const validateInput = (name, value) => {
    if (!value.trim()) return `${name} is required.`;
    if (name === "name") {
      if (value.startsWith(" ")) return "Name cannot start with a space.";
      if (/^\d+$/.test(value)) return "Name cannot contain only numbers."; // Prevents names with only digits
    }
    if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Invalid email address.";
    if (name === "phone" && !/^\d{10}$/.test(value))
      return "Phone number must be exactly 10 digits.";
    return "";
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && /\D/.test(value)) return;
    const updatedValue = name === "name" ? value.trimStart() : value;
    setFormData({ ...formData, [name]: updatedValue });
    setErrors({ ...errors, [name]: validateInput(name, updatedValue) });
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setUser({ ...formData });
    setIsEditMode(false);
    console.log(formData); // Logs updated user data to console
    toast.success("Profile updated successfully!", { style: { background: "#4CAF50", color: "white" } });
  };

  // Handle cancel action
  const handleCancel = () => {
    setFormData({ ...user });
    setErrors({});
    setIsEditMode(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
      <Toaster position="top-center" />
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">User Profile</h2>
        {isEditMode ? (
          <form name="editUserDetailsForm" onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="text-center">
              <input type="file" accept="image/*" id="profile-picture-upload" className="hidden" onChange={handleProfilePictureChange} />
              <label htmlFor="profile-picture-upload" className="cursor-pointer">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-300">
                  <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <p className="text-md text-gray-500 mt-2">Change Profile Picture</p>
              </label>
            </div>

            {/* Input Fields */}
            {["name", "email", "phone"].map((field) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors[field] ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                />
                {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
              </div>
            ))}

            {/* Save and Cancel Buttons */}
            <div className="flex gap-2">
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Save</button>
              <button type="button" onClick={handleCancel} className="w-full bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-red-400 transition">Cancel</button>
            </div>
          </form>
        ) : (
          <div>
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-300">
                <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            {["name", "email", "phone"].map((field) => (
              <div key={field} className="mb-3 text-gray-700">
                <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}:</label> {user[field]}
              </div>
            ))}

            <button onClick={() => setIsEditMode(true)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
