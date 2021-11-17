import React from 'react';
import { FaConnectdevelop } from 'react-icons/fa';

const AccountCreatedCard = ({
  firstName,
  date,
}: {
  firstName: string;
  date: number;
}) => {
  const time = new Date(date).toLocaleDateString('cs-cz');

  return (
    <div className="w-full p-4 text-center text-black border border-indigo-600 rounded-2xl shadow-sm">
      <FaConnectdevelop size={64} className="m-auto" />
      {firstName} joined hiStories
      <br />
      on {time}
    </div>
  );
};

export default AccountCreatedCard;
