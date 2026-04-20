import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faShieldHalved,
  faCalendarDays,
  faIdBadge,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { authService } from "../services/auth.service";
import type { ProfileApiResponse } from "../types/auth.types";
import { SautiCloudLoader } from "../components/spinners/sauti.loader";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await authService.profile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <SautiCloudLoader />;
  }

  if (!profile?.data) {
    return (
      <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No profile data available</p>
        </div>
      </div>
    );
  }

  const { first_name, last_name, email, role, created_at, id } = profile.data;
  const memberSince = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const initials = `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();

  const infoCards = [
    {
      label: "User ID",
      value: `#${id}`,
      icon: faIdBadge,
    },
    {
      label: "Email",
      value: email,
      icon: faEnvelope,
    },
    {
      label: "Role",
      value: role,
      icon: faShieldHalved,
    },
    {
      label: "Member Since",
      value: memberSince,
      icon: faCalendarDays,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#12245B]">My Profile</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Manage your account details and preferences
          </p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
          {/* Gradient Banner */}
          <div className="h-32 bg-gradient-to-r from-[#12245B] to-[#020617] relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoNnptMC0zMHY2aC02VjRoNnptMCAxMHY2aC02VjE0aDZ6bTAgMTB2NmgtNlYyNGg2em0wIDEwdjZoLTZWMzRoNnptMTAgMHY2aC02VjM0aDZ6bS0yMCAwdjZoLTZWMzRoNnptMTAgMHY2aC02VjM0aDZ6bS0xMCAwdjZoLTZWMzRoNnptMCAxMHY2aC02VjQ0aDZ6bTEwIDB2NmgtNlY0NGg2em0xMCAwdjZoLTZWNDRoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>
          </div>

          {/* Avatar & Info */}
          <div className="px-6 pb-6 -mt-16 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-[#F48120] flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                {initials}
              </div>

              {/* Name & Role */}
              <div className="flex-1 pt-16">
                <h2 className="text-2xl font-bold text-[#12245B]">
                  {first_name} {last_name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F48120]/10 text-[#F48120] text-xs font-semibold">
                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                    {role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {infoCards.map((card) => (
            <div
              key={card.label}
              className="bg-white border border-gray-200 rounded-xl p-5 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#12245B]/5 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={card.icon}
                    className="w-4 h-4 text-[#12245B]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#12245B] truncate">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Status Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <h3 className="text-sm font-semibold text-[#12245B]">
                  Account Active
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your account is in good standing
                </p>
              </div>
            </div>
            <span className="text-xs text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
