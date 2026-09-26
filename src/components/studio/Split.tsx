import { Fragment } from 'react';

/**
 * Sets a line of display type one letter per span, so titles can arrive a
 * letter at a time. Words stay unbroken; `start` continues the stagger count
 * across pieces of one title (for example, into an <em>). Screen readers and
 * search engines read the text as written.
 */
export default function Split({ text, start = 0 }: { readonly text: string; readonly start?: number }) {
  let c = start;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, w) => (
        <Fragment key={w}>
          {word && (
            <span>
              {Array.from(word).map((ch, i) => (
                <span key={i} style={{ ['--c' as string]: c++ }}>
                  {ch}
                </span>
              ))}
            </span>
          )}
          {w < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}
