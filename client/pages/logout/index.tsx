/**
 * Represents the logout page component.
 */
import { useState, useContext, useEffect } from 'react';
import { API_URL } from '../../constants';
import { useRouter } from 'next/router';
import { AuthContext, UserInfo } from '../../modules/auth_provider';

const Index = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const { authenticated, setAuthenticated } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext); // Add setUser to update user info

  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push('/');
    }
  }, [authenticated]);

  /**
   * Handles the logout action.
   */
  const logoutHandler = () => {
    localStorage.removeItem('user_info');
    setAuthenticated(false);
    setUser({} as UserInfo);
    // You may also want to redirect the user to the login page or another appropriate page
    router.push('/login');
  };

  return (
    <div className='flex items-center justify-center min-w-full min-h-screen'>
      <div>
        {/* Display logout button if authenticated */}
        {authenticated && (
          <button
            className='p-3 mt-6 rounded-md bg-red font-bold text-white'
            onClick={logoutHandler}
          >
            Logout
          </button>
        )}
        <form className='flex flex-col md:w-1/5'>
          {/* ... (your existing login form) */}
        </form>
      </div>
    </div>
  );
};

export default Index;
