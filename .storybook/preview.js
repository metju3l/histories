import * as NextImage from 'next/image';

const OriginalNextImage = NextImage.default; // local variable for next image

// replaces next image with a unoptimazed version
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => <OriginalNextImage {...props} unoptimized />,
});

export const parameters = {
  layout: 'fullscreen', // disable default storybook canvas padding
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
