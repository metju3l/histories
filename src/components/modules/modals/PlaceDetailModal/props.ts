import React from 'react';

// if there are some of these values known, use them as placeholder before query is done
interface PlaceDetailModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  place?: {
    name?: string | null;
    description?: string | null;
    latitude?: number;
    longitude?: number;
    preview?: {
      hash?: string;
      blurhash?: string;
    } | null;
    nearbyPlaces?: {
      id?: number;
      preview?: {
        hash?: string;
        blurhash?: string;
      } | null;
      name?: string;
      description?: string;
    };
  };
}

export default PlaceDetailModalProps;
