import { MapStyles } from '@lib/types/map';

import { Dark, Light, Satellite } from '../../../shared/config/MapStyles';

function GetMapStyle(style: MapStyles, theme?: string) {
  return style === 'theme'
    ? theme === 'dark'
      ? Dark
      : Light
    : style === 'dark'
    ? Dark
    : style === 'satellite'
    ? Satellite
    : Light;
}

export default GetMapStyle;
