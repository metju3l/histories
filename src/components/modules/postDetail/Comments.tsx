import { useCreateCommentMutation } from '@graphql/mutations/comment.graphql';
import { PostQuery } from '@graphql/queries/post.graphql';
import UrlPrefix from '@src/constants/IPFSUrlPrefix';
import MeContext from '@src/contexts/MeContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { HiPaperAirplane } from 'react-icons/hi';

interface PostDetailCommentSectionProps {
  post: PostQuery['post'];
}

interface CreateCommentFormInput {
  text: string;
}

const PostDetailCommentSection: React.FC<PostDetailCommentSectionProps> = ({
  post,
}) => {
  const meContext = useContext(MeContext); // me context
  const { register, watch, handleSubmit, reset } =
    useForm<CreateCommentFormInput>(); // create comment form
  const [createCommentMutation] = useCreateCommentMutation(); // create comment mutation
  const { t } = useTranslation<string>(); // i18n
  const router = useRouter();

  async function OnSubmit(data: CreateCommentFormInput) {
    try {
      await createCommentMutation({
        variables: { input: { content: data.text, target: post.id } },
      });
      reset();
      router.reload(); // this is too bad and needs to be fixed ASAP
    } catch (error: any) {
      toast.error(t('something went wrong'));
    }
    console.log(data);
  }

  return (
    <div className="h-full p-2">
      {/* AUTHOR */}
      <div className="flex items-center gap-2">
        <Link href={`/user/${post.author.username}`} passHref>
          <div className="relative w-10 h-10 rounded-full">
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
      {post.comments.map((comment) => {
        return (
          <div key={comment?.id} className="flex mb-4 gap-2">
            <Link href={`/user/${comment?.author.username}`} passHref>
              <div className="relative w-10 h-10 rounded-full">
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
      })}
      {/* CREATE COMMENT FORM */}
      {meContext.isLoggedIn && (
        <form onSubmit={handleSubmit(OnSubmit)}>
          <div> Create comment:</div>
          <div className="flex items-center px-4 bg-white border border-gray-200 rounded-xl gap-4 shadow-sm">
            <input
              {...register('text')}
              className="w-full py-2 border-none outline-none"
            />
            <button type="submit">
              <HiPaperAirplane className="-mt-1 text-blue-500 transform rotate-45 w-7 h-7 hover:scale-95 ease-in-out hover:text-blue-600" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PostDetailCommentSection;
