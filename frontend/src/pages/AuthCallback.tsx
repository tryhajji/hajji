import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth, db, UserData } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAppContext } from '../contexts/AppContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleSignIn } = useAppContext();
  const error = searchParams.get('error');

  useEffect(() => {
    const handleCallback = async () => {
      if (error) {
        console.error('Authentication error:', error);
        navigate('/sign-in?error=auth_failed');
        return;
      }

      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('No user found');
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          handleSignIn(userDoc.data() as UserData);
          navigate('/');
        } else {
          throw new Error('User document not found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/sign-in?error=no_user');
      }
    };

    handleCallback();
  }, [error, navigate, handleSignIn]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processing authentication...</h2>
        <p className="text-gray-500">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthCallback; 