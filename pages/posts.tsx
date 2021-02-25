import React, { useRef, useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { IPost } from '@core/entities';
import { usePostForm } from '@hooks/index';
import { getCookies, verifyToken } from '@lib/utils';

import Modal from '@components/modal';
import Layout from '@components/layout';
import FormInput from '@components/form-input';
import Pagination from '@components/pagination';
import Unauthorized from '@components/unauthorized';

import styles from '../styles/posts.module.scss';
import postStyles from '../styles/post.module.scss';

export async function getServerSideProps({ query: { page = 1 }, req }) {
  const { token = '' } = getCookies(req);
  const session = verifyToken(token);

  if (!session) {
    return {
      props: {
        posts: [],
        totalCount: 0,
        authenticated: false,
      },
    };
  }

  let totalCount = 0;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
  );

  const posts: IPost[] = await response.json();

  response.headers.forEach((value, name) => {
    if (name === 'x-total-count') {
      totalCount = Number(value);
    }
  });

  return {
    props: {
      posts,
      totalCount,
      authenticated: true,
    },
  };
}

interface PostsProps {
  posts: IPost[];
  totalCount: number;
  authenticated: boolean;
}

export default function Posts({ authenticated, posts = [], totalCount = 0 }: PostsProps) {
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

  if (!authenticated) {
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>

      <Layout>
        {authenticated ? (
          _posts.length === 0 ? (
            'No posts found.'
          ) : (
            <>
              <h2>Posts</h2>
              <section className={styles.container}>
                {_posts.map((post) => (
                  <Post key={post.id} post={post} onClick={() => setPost(post)} />
                ))}
              </section>
            </>
          )
        ) : (
          <Unauthorized />
        )}
      </Layout>

      {authenticated && (
        <>
          <Pagination
            path="posts"
            totalCount={totalCount}
            page={query.page ? Number(query.page) : 1}
          />

          {post && (
            <EditPostModal post={post} onClose={() => setPost(undefined)} onEdit={handleEditPost} />
          )}
        </>
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
          <FormInput id="body" label="Body" ref={register} />
        </section>

        <button type="submit">Edit</button>
      </form>
    </Modal>
  );
};
