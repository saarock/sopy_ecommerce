import { useState } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from "../../constant";
import { Auth } from "../../services";
import { toast } from "react-toastify";
import { handleResponse } from "../../utils";
import Cookie from "../../utils/cookie";
import LocalStorage from "../../utils/localStorage";
import { login } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [userLoginFormData, setUserLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUserLoginFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await handleResponse(Auth.login(userLoginFormData));
      if (response.error) {
        toast.error(response.error);
        return;
      }

      const { refreshToken, accessToken, userWithoutSensativeData } = response.data;

      Cookie.set(ACCESS_TOKEN_COOKIE_NAME, accessToken, 1);
      Cookie.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, 10);
      LocalStorage.setItem("userData", userWithoutSensativeData);

      const user = { token: accessToken, ...userWithoutSensativeData };
      dispatch(login(user));
      // Redirect handled by ProtectedPage/App logic usually, but here:
      if (user.role === "admin") {
        // Since dashboard is disabled, go to home
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
      <form onSubmit={signIn} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
              value={userLoginFormData.email}
              onChange={onInputChange}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-black hover:underline">Forgot password?</Link>
            </div>
          </div>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={userLoginFormData.password}
              onChange={onInputChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">Don't have an account? </span>
          <Link to="/register" className="font-medium text-black hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
