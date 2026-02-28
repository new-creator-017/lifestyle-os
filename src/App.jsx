import { useLifestyle } from "./context/LifestyleContext";
import { APP_MODULES } from "./modules/moduleConfig";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LoginModule from "./modules/LoginModule.jsx";

export default function App() {
  const { user, authLoading } = useLifestyle();

  if (authLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  /**
   * 2. THE REDIRECT LOGIC
   * If Firebase found a user, we show the Dashboard.
   * Otherwise, we show the Login screen.
   */
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <LoginModule /> : <Navigate to="/" />}
        />

        {/* AUTOMATED PROTECTED ROUTES */}
        {APP_MODULES.map((module) => (
          <Route
            key={module.path}
            path={module.path}
            element={
              user ? (
                <Layout>
                  <module.component />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        ))}

        {/* Catch-all: Redirect unknown paths to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
