import React from 'react';
import { FaConnectdevelop } from 'react-icons/fa';

const AccountCreatedPost = ({
  firstName,
  date,
}: {
  firstName: string;
  date: string;
}) => {
  const time = new Date(parseInt(date)).toLocaleDateString('cs-cz');

  return (
    <div className="w-full p-4 rounded-2xl text-black text-center shadow-sm border border-indigo-600">
      <FaConnectdevelop size={64} className="m-auto" />
      {firstName} joined hiStories
      <br />
      on {time}
    </div>
  );
};

export default AccountCreatedPost;
