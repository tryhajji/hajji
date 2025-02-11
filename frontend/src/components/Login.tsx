import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await login(credentialResponse.credential);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
}; 