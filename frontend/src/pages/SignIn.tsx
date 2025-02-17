import { useForm } from "react-hook-form";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserData } from '../firebase';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const { handleSignIn } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const onSubmit = async (data: SignInFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (userDoc.exists()) {
        handleSignIn(userDoc.data() as UserData);
        navigate("/");
      } else {
        console.error('User document not found');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Create or update user document in Firestore
      const userData: UserData = {
        uid: user.uid,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        role: 'user'
      };

      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });
      
      // Important: Call handleSignIn to update the app context
      handleSignIn(userData);
      
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">
              {error === 'auth_failed' && 'Authentication failed. Please try again.'}
              {error === 'no_user' && 'No user found. Please try again.'}
              {error === 'unknown' && 'An unknown error occurred. Please try again.'}
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                {...register("email", { required: "This field is required" })}
                className="appearance-none relative block w-full px-4 h-[48px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm mt-1"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register("password", { required: "This field is required", minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }})}
                className="appearance-none relative block w-full px-4 h-[48px] border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm mt-1"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/reset-password" className="font-medium text-primary hover:text-primary-dark">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-[48px] bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative">
            <span className="px-4 bg-gray-50 text-gray-500 text-sm">or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <i className="fab fa-facebook text-[#1877F2]"></i>
            <span>Continue with Facebook</span>
          </button>
          
          <button 
            onClick={handleGoogleLogin}
            className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <i className="fab fa-apple text-black"></i>
            <span>Continue with Apple</span>
          </button>
          
          <button className="w-full h-[48px] border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
            <i className="far fa-envelope"></i>
            <span>Continue with email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
