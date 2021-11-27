import React from 'react';

const PostTimeline: React.FC<{ time: number; show?: boolean }> = ({
  time,
  children,
  show,
}) => {
  const postDateMonth = new Date(time).toLocaleDateString('en-us', {
    month: 'short',
  });
  const postDateDay = new Date(time).toLocaleDateString('en-us', {
    day: '2-digit',
  });
  const postDateYear = new Date(time).toLocaleDateString('en-us', {
    year: 'numeric',
  });

  return show ? (
    // with timeline on side
    <div className="flex items-center w-full pl-16 border-l border-gray-500 border-dashed">
      <div className="flex items-center w-28 ml-[-4.5em] text-primary">
        <div className="w-4 h-4 mr-2 bg-white border-2 border-gray-500 rounded-full bg-primary" />
        {postDateDay}. {postDateMonth}.
        <br />
        {postDateYear}
      </div>
      {children}
    </div>
  ) : (
    // without timeline
    <>{children}</>
  );
};

export default PostTimeline;
