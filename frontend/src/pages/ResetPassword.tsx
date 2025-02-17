import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../firebase';
import { sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';

interface ResetFormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode'); // Firebase's reset code
  
  const handlePasswordReset = async (data: ResetFormData) => {
    if (!data.email) return;
    try {
      await sendPasswordResetEmail(auth, data.email);
      alert('Password reset email sent. Please check your inbox.');
      navigate('/sign-in');
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Failed to send reset email. Please try again.');
    }
  };

  const handlePasswordUpdate = async (data: ResetFormData) => {
    if (!data.password || !data.confirmPassword) return;
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      if (!oobCode) {
        throw new Error('No reset code found');
      }
      await confirmPasswordReset(auth, oobCode, data.password);
      alert('Password updated successfully');
      navigate('/sign-in');
    } catch (error) {
      console.error('Password update error:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {oobCode ? 'Reset Your Password' : 'Forgot Password'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit(oobCode ? handlePasswordUpdate : handlePasswordReset)}>
          {!oobCode ? (
            <div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message as string}</p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: 6 })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="New password"
                />
                <input
                  type="password"
                  {...register('confirmPassword', { required: 'Please confirm password' })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Confirm new password"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message as string}</p>
              )}
            </>
          )}
          
          <div className="mt-6">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {oobCode ? 'Update Password' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword; 