import { useState } from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiCalendarLine, RiUserLine } from 'react-icons/ri';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const router = useRouter();

  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [posts, setPosts] = useState(postsPagination.results);

  async function handleMorePosts(): Promise<void> {
    const result = await fetch(nextPage);
    const { results, next_page } = await result.json();

    setPosts([...posts, ...results]);
    setNextPage(next_page);
  }

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Header />
      <main>
        {posts.map(post => (
          <div
            key={post.uid}
            className={styles.post}
            onClick={() => router.push(`/post/${post.uid}`, '', {})}
          >
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
            <div className={styles.postinfo}>
              <div>
                <RiCalendarLine />
                <span>
                  {post.first_publication_date &&
                    format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
                </span>
              </div>
              <div>
                <RiUserLine />
                <span>{post.data.author}</span>
              </div>
            </div>
          </div>
        ))}
      </main>
      {nextPage && (
        <footer>
          <button type="button" onClick={handleMorePosts}>
            Carregar mais posts
          </button>
        </footer>
      )}
      {preview && (
        <aside>
          <Link href="/api/exit-preview">
            <a>Sair do modo Preview</a>
          </Link>
        </aside>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const { results, next_page } = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      page: 1,
      ref: previewData?.ref ?? null,
    }
  );

  return {
    props: {
      postsPagination: {
        results,
        next_page,
      },
      preview,
    },
  };
};
