import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { RiCalendarLine, RiTimeLine, RiUserLine } from 'react-icons/ri';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
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
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  useEffect(() => {
    let totalWordsInText = 0;

    for (let i = 0; i < post.data.content.length; i++) {
      const content = post.data.content[i];
      totalWordsInText += content.heading?.split(' ').length ?? 0;
      totalWordsInText += RichText.asText(content.body).split(' ').length;
    }

    setEstimatedReadTime(Math.ceil(totalWordsInText / 200));
  }, [post.data.content]);

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

export const getStaticProps: GetStaticProps = async ({
  params,
}): Promise<GetStaticPropsResult<PostProps>> => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post,
    },
  };
};
