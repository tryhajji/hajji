import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCurrentUser, getUserRole } from '../appwrite';
import { useAppContext } from '../contexts/AppContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleSignIn } = useAppContext();
  const error = searchParams.get('error');

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (error) {
        console.error('Authentication failed');
        navigate('/sign-in?error=auth_failed');
        return;
      }

      try {
        const user = await getCurrentUser();
        if (user) {
          await handleSignIn(user);
          const role = await getUserRole();
          
          // Redirect based on role
          switch (role) {
            case 'admin':
              navigate('/admin/dashboard');
              break;
            case 'agency':
              navigate('/agency/dashboard');
              break;
            case 'umrah_group':
              navigate('/umrah-group/dashboard');
              break;
            default:
              navigate('/user/dashboard');
          }
        } else {
          navigate('/sign-in?error=no_user');
        }
      } catch (err) {
        console.error('Error in auth callback:', err);
        navigate('/sign-in?error=unknown');
      }
    };

    handleAuthCallback();
  }, [error, navigate, handleSignIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Processing your sign in...
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please wait while we complete your authentication
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback; 