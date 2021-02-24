import React, { useCallback, useState } from 'react';
import Head from 'next/head';

import { usePostForm } from '../hooks';
import Modal from '../components/modal';
import Layout from '../components/layout';
import styles from '../styles/posts.module.css';
import FormInput from '../components/form-input';
import postStyles from '../styles/post.module.css';

interface IPost {
  id: string;
  title: string;
  body: string;
  userId: string;
}

export async function getServerSideProps() {
  let totalCount = 0;
  const response = await fetch('https://jsonplaceholder.typicode.com/posts?_start=0&_limit=10');

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
    },
  };
}

interface PostsProps {
  posts: IPost[];
  totalCount: number;
}

export default function Posts({ posts = [], totalCount = 0 }: PostsProps) {
  // big anti pattern to duplicate props in state
  // I do this because the API is a dummy and editing is faked
  const [_posts, setPosts] = useState<IPost[]>(() => posts);
  const [post, setPost] = useState<IPost>();

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
      </Head>

      <Layout>
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
      </Layout>

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
  const { register, handleEdit } = usePostForm(post, onEdit);

  return (
    <Modal isOpen={true} onClose={onClose}>
      <form className={postStyles.root} onSubmit={handleEdit}>
        <section>
          <FormInput id="title" label="Title" ref={register} />
          <FormInput id="body" label="Body" ref={register} />
        </section>

        <button type="submit">Edit</button>
      </form>
    </Modal>
  );
};
