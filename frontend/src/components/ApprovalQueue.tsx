import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';

interface ApprovalRequest {
  id: string;
  type: 'agency' | 'umrah_group';
  name: string;
  email: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details: {
    organizationName: string;
    licenseNumber: string;
    yearsOfExperience: string;
    description: string;
    [key: string]: any;
  };
}

const ApprovalQueue: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery<ApprovalRequest[]>(
    'approvalRequests',
    async () => {
      // Replace with your actual API call
      const response = await fetch('/api/approval-requests');
      return response.json();
    }
  );

  const { mutate: updateStatus } = useMutation(
    async ({ id, status, notes }: { id: string; status: 'approved' | 'rejected'; notes: string }) => {
      // Replace with your actual API call
      await fetch(`/api/approval-requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('approvalRequests');
      },
    }
  );

  const handleApproval = (id: string, status: 'approved' | 'rejected') => {
    const notes = status === 'rejected' ? prompt('Please provide a reason for rejection:') : '';
    if (status === 'rejected' && !notes) return;
    updateStatus({ id, status, notes: notes || '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Pending Approvals
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Review and approve registration requests from agencies and Umrah groups.
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        {requests?.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-check-circle text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">No pending approvals</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {requests?.map((request) => (
              <li key={request.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
                            <i className={`fas fa-${request.type === 'agency' ? 'building' : 'users'} text-primary`}></i>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">
                            {request.name}
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {request.type === 'agency' ? 'Travel Agency' : 'Umrah Group'}
                            </span>
                          </h4>
                          <p className="text-sm text-gray-500">
                            {request.details.organizationName} • Registered {format(new Date(request.registrationDate), 'PPP')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">License Information</h5>
                        <p className="mt-1 text-sm text-gray-900">
                          License: {request.details.licenseNumber}<br />
                          Experience: {request.details.yearsOfExperience} years
                        </p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-500">Contact Information</h5>
                        <p className="mt-1 text-sm text-gray-900">
                          Email: {request.email}<br />
                          Phone: {request.details.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-500">Description</h5>
                      <p className="mt-1 text-sm text-gray-900">
                        {request.details.description}
                      </p>
                    </div>
                  </div>

                  <div className="ml-6 flex-shrink-0 flex space-x-4">
                    <button
                      onClick={() => handleApproval(request.id, 'approved')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <i className="fas fa-check mr-2"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(request.id, 'rejected')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <i className="fas fa-times mr-2"></i>
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApprovalQueue; 