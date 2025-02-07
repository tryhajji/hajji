import { FC } from 'react';
import { Link } from 'react-router-dom';

const RegistrationPending: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <i className="fas fa-clock text-4xl text-primary"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Registration Pending Approval
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for registering! Your application is currently under review by our admin team.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-info-circle text-blue-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    We will review your application and get back to you within 2-3 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-900">What happens next?</h3>
              <div className="mt-3 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-envelope text-primary"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    You will receive an email notification once your application has been reviewed.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-primary"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    If approved, you will be able to access your dashboard and start managing your services.
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-question-circle text-primary"></i>
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    If we need any additional information, we will contact you via email.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPending; 