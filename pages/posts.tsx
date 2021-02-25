import React, { useRef, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { IPost } from '@core/entities';
import { getSession } from '@lib/utils';
import { usePostForm } from '@hooks/index';
import { getPaginatedData } from '@lib/getPaginatedData';

import Modal from '@components/modal';
import FormInput from '@components/form-input';
import AuthGuard from '@components/auth-guard';
import Pagination from '@components/pagination';
import FormTextarea from '@components/form-textarea';

import styles from '../styles/posts.module.scss';
import postStyles from '../styles/post.module.scss';

const POSTS_PER_PAGE = 8;

export async function getServerSideProps({ query: { page = 1 }, req }) {
  const session = getSession(req);

  if (!session) {
    return {
      props: {
        posts: [],
        totalCount: 0,
        isAuthenticated: false,
      },
    };
  }

  const { data: posts, totalCount } = await getPaginatedData<IPost>({
    page,
    entity: 'posts',
    limit: POSTS_PER_PAGE,
  });

  return {
    props: {
      posts,
      totalCount,
      isAuthenticated: true,
    },
  };
}

interface PostsProps {
  posts: IPost[];
  totalCount: number;
  isAuthenticated: boolean;
}

export default function Posts({ isAuthenticated, posts = [], totalCount = 0 }: PostsProps) {
  const { query } = useRouter();

  // #region !! REACT ANTI PATTERN WARNING !!

  // big anti pattern to duplicate props in state
  // I do this because the API is a dummy and editing is faked
  const [_posts, setPosts] = useState<IPost[]>(() => posts);
  const [post, setPost] = useState<IPost>();

  useEffect(() => {
    setPosts(posts);
  }, [posts]);
  // #endregion

  const handleEditPost = useCallback(
    (updatedPost: IPost) => {
      setPosts((posts) => {
        return posts.map((p) => (p.id === post.id ? { ...post, ...updatedPost } : p));
      });
      setPost(undefined);
    },
    [post, setPosts],
  );

  return (
    <>
      <Head>
        <title>Posts</title>
        <meta name="author" content="Alex M." />
        <meta property="og:description" content="Code assignment posts" />
        {/* Other meta tags for SEO should be here. */}
      </Head>

      <AuthGuard
        isAuthenticated={isAuthenticated}
        pagination={
          <Pagination
            path="posts"
            totalCount={totalCount}
            itemsPerPage={POSTS_PER_PAGE}
            page={query.page ? Number(query.page) : 1}
          />
        }
      >
        <h2>Posts</h2>
        {_posts.length === 0 ? (
          'No posts found.'
        ) : (
          <section className={styles.container}>
            {_posts.map((post) => (
              <Post key={post.id} post={post} onClick={() => setPost(post)} />
            ))}
          </section>
        )}
      </AuthGuard>
      {post && (
        <EditPostModal post={post} onClose={() => setPost(undefined)} onEdit={handleEditPost} />
      )}
    </>
  );
}

interface PostProps {
  post: IPost;
  onClick(): void;
}

const Post: React.FC<PostProps> = ({ post, onClick }) => {
  return (
    <div className={styles.post} onClick={onClick}>
      <h4>{post.title}</h4>
      <span>{post.body}</span>
    </div>
  );
};

interface EditPostModalProps {
  post: IPost;
  onClose(): void;
  onEdit(post: IPost): void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ onClose, post, onEdit }) => {
  const ref = useRef(null);
  const { register, handleEdit } = usePostForm(post, onEdit);

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <form className={postStyles.root} onSubmit={handleEdit}>
        <button className={postStyles.close} onClick={onClose} ref={ref}>
          X
        </button>
        <section>
          <FormInput id="title" label="Title" ref={register} />
          <FormTextarea id="body" label="Body" ref={register} />
        </section>

        <div className={postStyles.buttonContainer}>
          <button onClick={onClose}>Cancel</button>
          <button type="submit">Edit</button>
        </div>
      </form>
    </Modal>
  );
};
