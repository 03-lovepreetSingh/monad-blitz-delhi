"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Wallet,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
  Bell,
  Shield,
  Palette,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  walletAddress: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  walletAddress?: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Lovepreet Singh",
    email: "lovepreet@learnfast.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    walletAddress: "0x742d35Cc6634C0532925a3b8D1b9E7E0b3C4EF1d",
  });

  const [originalData, setOriginalData] = useState<ProfileData>({
    ...profileData,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to set new password";
      }
      if (profileData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (
      profileData.walletAddress &&
      !/^0x[a-fA-F0-9]{40}$/.test(profileData.walletAddress)
    ) {
      newErrors.walletAddress = "Please enter a valid Ethereum wallet address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOriginalData({ ...profileData });
      setIsEditing(false);
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      ...originalData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
    icon: Icon,
    error,
    showPassword,
    onTogglePassword,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    placeholder?: string;
    icon: React.ElementType;
    error?: string;
    showPassword?: boolean;
    onTogglePassword?: () => void;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-12 py-3 border-0 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:bg-gray-800/70 transition-all duration-200 ${
            error ? "ring-2 ring-red-500" : ""
          } ${
            !isEditing
              ? "opacity-60 cursor-not-allowed"
              : "hover:bg-gray-800/60"
          }`}
        />
        {type === "password" && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LearnFast
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">
                  {profileData.name}
                </span>
              </div>
              <button className="text-red-400 hover:text-red-300 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">
                {profileData.name}
              </h2>
              <p className="text-gray-400 mb-4">{profileData.email}</p>
              <div className="flex space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-800/30 rounded-xl p-1">
            {[
              { id: "profile", label: "Profile Information", icon: User },
              { id: "security", label: "Security", icon: Shield },
              { id: "preferences", label: "Preferences", icon: Palette },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                  activeTab === id
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  value={profileData.name}
                  onChange={(value) => handleInputChange("name", value)}
                  placeholder="Enter your full name"
                  icon={User}
                  error={errors.name}
                />

                <InputField
                  label="Email Address"
                  value={profileData.email}
                  onChange={(value) => handleInputChange("email", value)}
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  error={errors.email}
                />
              </div>

              <InputField
                label="Primary Wallet Address"
                value={profileData.walletAddress}
                onChange={(value) => handleInputChange("walletAddress", value)}
                placeholder="0x742d35Cc6634C0532925a3b8D1b9E7E0b3C4EF1d"
                icon={Wallet}
                error={errors.walletAddress}
              />
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Security Settings
              </h3>

              <div className="space-y-6">
                <InputField
                  label="Current Password"
                  value={profileData.currentPassword}
                  onChange={(value) =>
                    handleInputChange("currentPassword", value)
                  }
                  type="password"
                  placeholder="Enter current password"
                  icon={Lock}
                  error={errors.currentPassword}
                  showPassword={showPasswords.current}
                  onTogglePassword={() => togglePasswordVisibility("current")}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="New Password"
                    value={profileData.newPassword}
                    onChange={(value) =>
                      handleInputChange("newPassword", value)
                    }
                    type="password"
                    placeholder="Enter new password"
                    icon={Lock}
                    error={errors.newPassword}
                    showPassword={showPasswords.new}
                    onTogglePassword={() => togglePasswordVisibility("new")}
                  />

                  <InputField
                    label="Confirm New Password"
                    value={profileData.confirmPassword}
                    onChange={(value) =>
                      handleInputChange("confirmPassword", value)
                    }
                    type="password"
                    placeholder="Confirm new password"
                    icon={Lock}
                    error={errors.confirmPassword}
                    showPassword={showPasswords.confirm}
                    onTogglePassword={() => togglePasswordVisibility("confirm")}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-6">
                Account Preferences
              </h3>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="text-white font-medium">
                        Email Notifications
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Receive updates about your learning progress
                      </p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="text-white font-medium">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
