import React from 'react';
import ComplaintList from '../components/Complaint/ComplaintList';

/**
 * All Complaints page – thin wrapper around the ComplaintList component.
 */
export default function ComplaintsList() {
  return (
    <div>
      <ComplaintList />
    </div>
  );
}