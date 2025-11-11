import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Session } from "@supabase/supabase-js";

export const ProfileHeader = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState("User");
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        setUsername(session.user.user_metadata?.username || session.user.email?.split("@")[0] || "User");
      }
    };

    getSession();
  }, []);

  const getInitials = () => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={() => navigate("/profile")}
        className="relative group"
        title="View Profile"
      >
        {/* Main Circle Button */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer border-2 border-primary-foreground/20">
          <Avatar className="w-12 h-12 border-2 border-primary-foreground/30">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Tooltip on Hover */}
        <div className="absolute top-16 right-0 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg z-50">
          <div className="font-semibold">{username}</div>
          <div className="text-xs text-background/70">Click to manage</div>
        </div>

        {/* Active Indicator Pulse */}
        <div className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-20"></div>
      </button>
    </div>
  );
};
