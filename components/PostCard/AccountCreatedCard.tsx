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
    <div className="w-full p-4 py-12 mb-8 text-center text-white bg-[#242427] rounded-2xl shadow-sm">
      <a className="m-auto text-2xl ml-2">🚀</a>
      {firstName} joined hiStories
      <br />
      on {time}
    </div>
  );
};

export default AccountCreatedCard;
