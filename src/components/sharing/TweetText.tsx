import { Fragment } from 'react';
import Link from 'next/link';
import { URL_REGEX } from '@/lib/tweet';
import { convertToHttps } from '@/lib/utils';

interface Props {
  content: string;
}

const TweetText = ({ content }: Props) => {
  const words = content.split(' ');

  return (
    <>
      {words.map((word: string) => {
        return word.match(URL_REGEX) ? (
          <Fragment key={word + new Date()}>
            <Link href={word} target="_blank" className="text-blue">
              {convertToHttps(word)?.title}
            </Link>{' '}
          </Fragment>
        ) : (
          word + ' '
        );
      })}
    </>
  );
};

export default TweetText;
