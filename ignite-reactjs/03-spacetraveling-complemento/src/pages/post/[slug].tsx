import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { RiCalendarLine, RiTimeLine, RiUserLine } from 'react-icons/ri';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';
import { Utterances } from '../../components/Utterances';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  nextPost: Post;
  prevPost: Post;
  preview: boolean;
}

export default function Post({
  post,
  nextPost,
  prevPost,
  preview,
}: PostProps): JSX.Element {
  const router = useRouter();

  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  useEffect(() => {
    let totalWordsInText = 0;

    for (let i = 0; i < post.data.content.length; i++) {
      const content = post.data.content[i];
      totalWordsInText += content.heading?.split(' ').length ?? 0;
      totalWordsInText += RichText.asText(content.body).split(' ').length;
    }

    setEstimatedReadTime(Math.ceil(totalWordsInText / 200));
  }, [post.data.content]);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <div className={`${commonStyles.container}`}>
      <Header />
      <main className={styles.main}>
        <img src={post.data.banner.url} alt="banner" />
        <div>
          <h1>{post.data.title}</h1>
          <div className={styles.postinfo}>
            <div>
              <RiCalendarLine />
              <span>
                {post.first_publication_date &&
                  format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                    locale: ptBR,
                  })}
              </span>
            </div>
            <div>
              <RiUserLine />
              <span>{post.data.author}</span>
            </div>
            <div>
              <RiTimeLine />
              <span>{estimatedReadTime} min</span>
            </div>
          </div>
          <div className={styles.postinfo}>
            <div>
              <span>
                {post.last_publication_date &&
                  `* editado em ${format(
                    new Date(post.first_publication_date),
                    "dd MMM yyyy 'as' HH:mm",
                    {
                      locale: ptBR,
                    }
                  )}`}
              </span>
            </div>
          </div>

          {post.data.content.map(paragraph => (
            <div className={styles.content} key={paragraph.heading}>
              <h2>{paragraph.heading}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(paragraph.body),
                }}
              />
            </div>
          ))}
        </div>
        <footer>
          <div>
            <div>
              <Link href="/post/[slug]" as={`/post/${prevPost?.uid}`}>
                <a>
                  {prevPost && (
                    <>
                      <h3>{prevPost.data.title}</h3>
                      <span>Post anterior</span>
                    </>
                  )}
                </a>
              </Link>
              <Link href="/post/[slug]" as={`/post/${nextPost?.uid}`}>
                <a className={styles.nextPost}>
                  {nextPost && (
                    <>
                      <h3>{nextPost.data.title}</h3>
                      <span>Próximo post</span>
                    </>
                  )}
                </a>
              </Link>
            </div>

            <Utterances repo="Majortheus/03-spacetraveling-complemento" />
            {preview && (
              <aside>
                <Link href="/api/exit-preview">
                  <a>Sair do modo Preview</a>
                </Link>
              </aside>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      page: 1,
    }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  // TODO
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug), {
    ref: previewData?.ref ?? null,
  });

  const nextPostQuery = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date]',
      ref: previewData?.ref ?? null,
    }
  );

  const prevPostQuery = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
      after: `${post.id}`,
      orderings: '[document.first_publication_date desc]',
      ref: previewData?.ref ?? null,
    }
  );

  const nextPost =
    nextPostQuery.results.length > 0 ? nextPostQuery.results[0] : null;
  const prevPost =
    prevPostQuery.results.length > 0 ? prevPostQuery.results[0] : null;

  return {
    props: {
      post,
      nextPost,
      prevPost,
      preview,
    },
  };
};
