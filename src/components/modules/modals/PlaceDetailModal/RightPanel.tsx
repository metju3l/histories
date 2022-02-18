import MeContext from '@src/contexts/MeContext';
import Link from 'next/link';
import React, { useContext } from 'react';
import {
  HiOutlineLocationMarker,
  HiOutlinePlusCircle,
  HiOutlineStar,
} from 'react-icons/hi';

interface PlaceDetailModalRightSideProps {
  place: {
    id: number;
    latitude: number;
    longitude: number;
    name?: string | null;
    description?: string | null;
  };
}

const PlaceDetailModalRightSide: React.FC<PlaceDetailModalRightSideProps> = ({
  place,
}) => {
  const meContext = useContext(MeContext);

  return (
    <div>
      <h1>{place?.name}</h1>
      <div className="flex justify-center py-2 gap-2">
        <Link
          href={`/?lat=${place.latitude}&lng=${place.longitude}&zoom=28.5&place=${place.id}`}
        >
          <a className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
            <HiOutlineLocationMarker /> Show on map
          </a>
        </Link>
        {meContext.data?.me && (
          <>
            <Link href={`/create/post?placeID=${place.id}`} passHref>
              <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
                <HiOutlinePlusCircle />
                Add photo
              </button>
            </Link>
            <button className="flex items-center px-4 py-2 border borer-gray-400 rounded-xl hover:bg-gray-100 gap-2">
              <HiOutlineStar />
              Add to favorites
            </button>
          </>
        )}
      </div>
      <p>{place?.description}</p>
    </div>
  );
};

export default PlaceDetailModalRightSide;
