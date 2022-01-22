import React from 'react';

export const PhotoMarkerIcon: React.FC = () => {
  return (
    <svg
      width="590"
      height="621"
      viewBox="0 0 590 621"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect x="36" y="64" width="523" height="417" fill="white" />
      <path
        d="M0 73.7143C0 54.164 7.77007 35.4145 21.6009 21.5904C35.4317 7.76631 54.1903 0 73.75 0H516.25C535.81 0 554.568 7.76631 568.399 21.5904C582.23 35.4145 590 54.164 590 73.7143V442.286C590 461.836 582.23 480.585 568.399 494.41C554.568 508.234 535.81 516 516.25 516H73.75C54.1903 516 35.4317 508.234 21.6009 494.41C7.77007 480.585 0 461.836 0 442.286V73.7143V73.7143ZM36.875 405.429V442.286C36.875 452.061 40.76 461.436 47.6754 468.348C54.5908 475.26 63.9701 479.143 73.75 479.143H516.25C526.03 479.143 535.409 475.26 542.325 468.348C549.24 461.436 553.125 452.061 553.125 442.286V313.286L413.848 241.525C410.39 239.793 406.475 239.193 402.656 239.808C398.838 240.423 395.31 242.223 392.571 244.953L255.765 381.693L157.678 316.382C154.136 314.025 149.888 312.965 145.654 313.382C141.42 313.798 137.46 315.665 134.446 318.667L36.875 405.429ZM221.25 165.857C221.25 151.194 215.422 137.132 205.049 126.764C194.676 116.396 180.607 110.571 165.938 110.571C151.268 110.571 137.199 116.396 126.826 126.764C116.453 137.132 110.625 151.194 110.625 165.857C110.625 180.52 116.453 194.582 126.826 204.95C137.199 215.318 151.268 221.143 165.938 221.143C180.607 221.143 194.676 215.318 205.049 204.95C215.422 194.582 221.25 180.52 221.25 165.857Z"
        fill="currentColor"
      />
      <path d="M295 621L417.976 516H172.024L295 621Z" fill="currentColor" />
    </svg>
  );
};

export const CollectionsIcon: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 576 512"
    >
      <path
        fill="currentColor"
        d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"
      />
    </svg>
  );
};

export const BarsIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="bars"
      className={className}
      role="img"
      viewBox="0 0 448 512"
    >
      <path
        fill="currentColor"
        d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      />
    </svg>
  );
};

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="plus"
      className={className}
      role="img"
      viewBox="0 0 448 512"
    >
      <path
        fill="currentColor"
        d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
      />
    </svg>
  );
};

export const GridIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="th-large"
      className={className}
      role="img"
      viewBox="0 0 512 512"
    >
      <path
        fill="currentColor"
        d="M296 32h192c13.255 0 24 10.745 24 24v160c0 13.255-10.745 24-24 24H296c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24zm-80 0H24C10.745 32 0 42.745 0 56v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zM0 296v160c0 13.255 10.745 24 24 24h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm296 184h192c13.255 0 24-10.745 24-24V296c0-13.255-10.745-24-24-24H296c-13.255 0-24 10.745-24 24v160c0 13.255 10.745 24 24 24z"
      />
    </svg>
  );
};

export const PostsIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        fill="none"
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      ></path>
    </svg>
  );
};

export const MapIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      viewBox="0 0 576 512"
    >
      <path
        fill="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M560.02 32c-1.96 0-3.98.37-5.96 1.16L384.01 96H384L212 35.28A64.252 64.252 0 0 0 191.76 32c-6.69 0-13.37 1.05-19.81 3.14L20.12 87.95A32.006 32.006 0 0 0 0 117.66v346.32C0 473.17 7.53 480 15.99 480c1.96 0 3.97-.37 5.96-1.16L192 416l172 60.71a63.98 63.98 0 0 0 40.05.15l151.83-52.81A31.996 31.996 0 0 0 576 394.34V48.02c0-9.19-7.53-16.02-15.98-16.02zM224 90.42l128 45.19v285.97l-128-45.19V90.42zM48 418.05V129.07l128-44.53v286.2l-.64.23L48 418.05zm480-35.13l-128 44.53V141.26l.64-.24L528 93.95v288.97z"
      />
    </svg>
  );
};
