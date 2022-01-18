import { useDeleteMutation } from '@graphql/post.graphql';
import { useUnfollowMutation } from '@graphql/relations.graphql';
import { Menu, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { LoginContext } from '../../../pages/_app';
import DropdownItem from '../Dropdown/DropdownItem';
import DropdownTransition from '../Dropdown/DropdownTransition';

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

  return (
    <Menu as="div" className="relative">
      <Menu.Button as="div" className="flex items-center gap-2">
        {children}
      </Menu.Button>
      <Transition as={Fragment} {...DropdownTransition}>
        <Menu.Items
          as="div"
          className="absolute right-0 z-50 flex flex-col w-48 mt-2 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 focus:outline-none dark:border-gray-800 truncated"
        >
          {loginContext.data?.me?.id === author.id ? (
            <>
              {/* DELETE */}
              <DropdownItem
                text={t('delete_post')}
                top
                onClick={async () => {
                  try {
                    await deleteMutation({
                      variables: {
                        id,
                      },
                    });
                    setVisible('deleted');
                    toast.success(t('post_deleted'));
                  } catch (error: any) {
                    toast.error(error.message);
                  }
                }}
              />
            </>
          ) : (
            loginContext.data?.me?.id && (
              <>
                {/* REPORT */}
                <DropdownItem text={t('report_post')} top />

                {/* UNFOLLOW */}
                <DropdownItem
                  text={t('unfollow')}
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
                />
              </>
            )
          )}
          {/* GO TO POST */}
          <Menu.Item>
            <DropdownItem
              text={t('go_to_post')}
              href={`/post/${id}`}
              top={!loginContext.data?.me?.id}
            />
          </Menu.Item>

          {/* COPY LINK */}
          <Menu.Item>
            <DropdownItem
              text={t('copy_link')}
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `https://www.histories.cc/post/${id}`
                );
                toast.success(t('link_copied'));
              }}
            />
          </Menu.Item>

          {/* CANCEL */}
          <Menu.Item>
            <DropdownItem text={t('close')} onClick={() => {}} bottom />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default OptionsMenu;
