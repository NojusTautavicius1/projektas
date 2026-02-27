import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import { useEffect, useRef, useContext } from "react";
import { AuthContext } from "@/context";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;


  // tikriname ar yra prisijungęs vartotojas
  // jei nėra, peradresuojame į /auth/sign-in
  const {user, token} = useContext(AuthContext);

  const timeoutRef = useRef(null);
  useEffect(() => {
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(checkAuth, 1000);
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkAuth, 1000);
    }
    // console.log("user or token changed:", user, token, timeoutRef.current);
  }, [user, token]);

  const checkAuth = () => {
    if (!user || !token) {
      console.log("No user or token, redirecting to sign-in...");
      setTimeout(doNavigateSignIn, 1000);
    } else if (user.role !== 'admin') {
      console.log("User is not an admin, redirecting to sign-in...");
      setTimeout(doNavigateSignIn, 1000);
    }
  }


  const navigate = useNavigate();
  const doNavigateSignIn = () => {
    navigate("/auth/prisijungti");
  }

  return (
    user && token && (  
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,0.9))] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <Sidenav
          routes={routes}
          brandName="Admin Panel"
        />
        <div className="p-4 xl:ml-80 relative z-10">
          <DashboardNavbar />
          <Configurator />
          <IconButton
            size="lg"
            className="fixed bottom-8 right-8 z-40 rounded-full shadow-2xl bg-slate-900 border-2 border-blue-500 hover:bg-slate-800 hover:border-blue-400 transition-all duration-300"
            ripple={false}
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-white" />
          </IconButton>
          <Routes>
            {routes.map(
              ({ layout, pages }) =>
                layout === "admin" &&
                pages.map(({ path, element }) => (
                  <Route exact path={path} element={element} />
                ))
            )}
          </Routes>
          <div className="text-gray-400">
            <Footer />
          </div>
        </div>
      </div>
    )
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
