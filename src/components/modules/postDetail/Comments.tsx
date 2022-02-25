import { Input, Loading } from '@components/elements';
import { useCreateCommentMutation } from '@graphql/mutations/comment.graphql';
import { usePostCommentsQuery } from '@graphql/queries/comment.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiPaperAirplane } from 'react-icons/hi';

interface PostDetailCommentSectionProps {
  post: {
    author: {
      profile: string;
      username: string;
      firstName: string;
      lastName: string;
    };
    description?: string | null;
    createdAt: number;
    id: number;
  };
}

interface CreateCommentFormInput {
  content: string;
}

const PostDetailCommentSection: React.FC<PostDetailCommentSectionProps> = ({
  post,
}) => {
  const meContext = useContext(MeContext); // me context
  const { register, handleSubmit, reset } = useForm<CreateCommentFormInput>(); // create comment form
  const [createCommentMutation] = useCreateCommentMutation(); // create comment mutation
  const { t } = useTranslation(); // i18n

  const commentsQuery = usePostCommentsQuery({
    variables: {
      input: { skip: 0, take: 1000, sort: 'ASC', targetID: post.id },
    },
  });

  async function OnSubmit(data: CreateCommentFormInput) {
    console.log(data);
    try {
      await createCommentMutation({
        variables: { input: { content: data.content, target: post.id } },
      });
      reset();
      commentsQuery.refetch();
    } catch (error: any) {
      toast.error(t('something went wrong'));
    }
  }

  return (
    <div className="p-2">
      {/* AUTHOR */}
      <div className="flex items-center gap-2">
        <Link href={`/user/${post.author.username}`} passHref>
          <div className="relative w-10 rounded-full aspect-square">
            <Image
              src={
                post.author.profile.startsWith('http')
                  ? post.author.profile
                  : UrlPrefix + post.author.profile
              }
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              alt="Profile picture"
            />
          </div>
        </Link>
        <div className="flex flex-col">
          <Link href={`/user/${post.author.username}`}>
            <a className="text-lg font-semibold">{`${post.author.firstName} ${post.author.lastName}`}</a>
          </Link>
          <a className="text-gray-600 font-xs">
            {new Date(post.createdAt).toLocaleDateString('cs', {
              day: 'numeric',
              month: '2-digit',
              year: 'numeric',
            })}
          </a>
        </div>
      </div>
      {/* DESCRIPTION */}
      <p className="pb-2"> {post.description}</p>
      {/* COMMENTS */}
      <div className="pb-2 text-gray-900 font-sm">{t('comments')}:</div>
      {/* TBD: infinite scroll */}
      <div className="w-full overflow-y-auto">
        {commentsQuery.loading || commentsQuery.error ? (
          <Loading color="black" />
        ) : (
          commentsQuery.data?.comments.map((comment) => {
            return (
              <div key={comment?.id} className="flex pb-4 gap-2">
                <Link href={`/user/${comment?.author.username}`} passHref>
                  <div className="relative w-10 rounded-full aspect-square">
                    <Image
                      src={
                        comment?.author?.profile.startsWith('http')
                          ? comment.author.profile
                          : UrlPrefix + comment?.author.profile
                      }
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                      alt="Profile picture"
                    />
                  </div>
                </Link>
                <div className="p-2 bg-gray-200 rounded-t-lg rounded-r-lg w-fit">
                  {comment?.content}
                </div>
              </div>
            );
          })
        )}
      </div>
      {/* CREATE COMMENT FORM */}
      {meContext.isLoggedIn && (
        <form onSubmit={handleSubmit(OnSubmit)}>
          <Input
            register={register}
            name="content"
            options={{ required: true }}
            label={t('create_comment')}
            rightIcon={
              <button type="submit">
                <HiPaperAirplane className="-mt-2 text-blue-500 transform rotate-45 w-7 h-7 hover:scale-95 ease-in-out hover:text-blue-600" />
              </button>
            }
          />
        </form>
      )}
    </div>
  );
};

export default PostDetailCommentSection;
