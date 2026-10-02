import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

import { getCurrentUser } from "../../api/authapi";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState(null);

  // Get current logged-in user from backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();

        console.log("Current user:", data);

        setUser(data.user);

        // Keep localStorage updated
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error("Failed to get current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="h-20 bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      {/* Left - Pharmacy */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          MediCare Pharmacy
        </h1>

        <p className="text-sm text-gray-500">
          Pharmacy Management System
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-8">

        {/* Date & Time */}
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {date}
          </p>

          <p className="text-sm text-green-600 font-semibold">
            {time}
          </p>
        </div>

        {/* Current User */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">

          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>

          <div>
            <p className="text-xs text-gray-500">
              Welcome
            </p>

            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "Loading..."}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;