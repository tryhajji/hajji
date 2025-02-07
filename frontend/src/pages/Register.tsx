import { FC } from 'react';
import { Link } from 'react-router-dom';

const Register: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create an Account
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            Choose the type of account you want to create
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Personal Account */}
          <Link
            to="/user/register"
            className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition duration-150"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition duration-150">
                <i className="fas fa-user text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Account</h3>
              <p className="text-sm text-gray-500">
                For individuals planning Hajj or Umrah
              </p>
            </div>
          </Link>

          {/* Travel Agency Account */}
          <Link
            to="/agency/register"
            className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition duration-150"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition duration-150">
                <i className="fas fa-building text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Travel Agency</h3>
              <p className="text-sm text-gray-500">
                For licensed travel agencies offering Hajj and Umrah packages
              </p>
            </div>
          </Link>

          {/* Umrah Group Account */}
          <Link
            to="/umrah-group/register"
            className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-primary transition duration-150"
          >
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition duration-150">
                <i className="fas fa-users text-2xl text-primary"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Umrah Group Leader</h3>
              <p className="text-sm text-gray-500">
                For religious organizations and group leaders
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <span className="text-sm text-gray-500">Already have an account?</span>
          <Link
            to="/sign-in"
            className="ml-2 text-sm font-medium text-primary hover:text-primary-dark"
          >
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
