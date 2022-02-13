import DeletePostModal from '@components/modules/modals/DeletePostModal';
import { useDeleteMutation } from '@graphql/mutations/post.graphql';
import { useUnfollowMutation } from '@graphql/mutations/relations.graphql';
import { Menu, Transition } from '@headlessui/react';
import Link from 'next/link';
import React, { Fragment, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../../../pages/_app';
import DropdownTransition from '../dropdown/DropdownTransition';

export type OptionsMenuProps = {
  id: number;
  author: {
    id: number;
  };
  setVisible: React.Dispatch<React.SetStateAction<'deleted' | null>>;
};

const OptionsMenu: React.FC<OptionsMenuProps> = ({
  author,
  id,
  setVisible,
  children,
}) => {
  const loginContext = React.useContext(LoginContext);
  const { t } = useTranslation();

  const [deleteMutation] = useDeleteMutation();
  const [unfollowMutation] = useUnfollowMutation();

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <DeletePostModal
        isOpen={isDeletePostModalOpen}
        setIsOpen={setIsDeletePostModalOpen}
        onConfirm={async () => {
          try {
            setVisible('deleted');

            await deleteMutation({
              variables: {
                id,
              },
            });
            toast.success(t('post_deleted'));
          } catch (error: any) {
            toast.error(error.message);
          }
        }}
      />
      <Menu as="div" className="relative">
        <Menu.Button as="div" className="flex items-center gap-2">
          {children}
        </Menu.Button>
        <Transition as={Fragment} {...DropdownTransition}>
          <Menu.Items as="div" className="dropdown">
            {loginContext.data?.me?.id === author.id ? (
              /* DELETE */
              <Menu.Item
                as="div"
                className="rounded-t-lg dropdown-item-danger"
                onClick={() => setIsDeletePostModalOpen(true)}
              >
                {t('delete_post')}
              </Menu.Item>
            ) : (
              loginContext.data?.me?.id && (
                <>
                  {/* REPORT */}
                  <Menu.Item as="div" className="rounded-t-lg dropdown-item">
                    {t('report_post')}
                  </Menu.Item>

                  {/* UNFOLLOW */}
                  <Menu.Item
                    as="div"
                    className="rounded-t-lg dropdown-item"
                    onClick={async () => {
                      try {
                        await unfollowMutation({
                          variables: {
                            userID: author.id,
                          },
                        });
                        toast.success(t('user_unfollowed'));
                      } catch (error: any) {
                        toast.error(error.message);
                      }
                    }}
                  >
                    {t('unfollow')}
                  </Menu.Item>
                </>
              )
            )}
            {/* GO TO POST */}
            <Link href={`/post/${id}`} passHref>
              <Menu.Item
                as="div"
                className={`${
                  !loginContext.data?.me?.id ? 'rounded-t-lg' : ''
                } dropdown-item`}
              >
                {t('go_to_post')}
              </Menu.Item>
            </Link>

            {/* COPY LINK */}
            <Menu.Item
              as="div"
              className="dropdown-item"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://www.histories.cc/post/${id}`
                );
                toast.success(t('link_copied'));
              }}
            >
              {t('copy_link')}
            </Menu.Item>

            {/* CLOSE */}
            <Menu.Item as="div" className="rounded-b-lg dropdown-item">
              {t('close')}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default OptionsMenu;
