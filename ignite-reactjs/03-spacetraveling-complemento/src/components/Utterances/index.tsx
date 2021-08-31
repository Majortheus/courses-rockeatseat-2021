import React, { Component, useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

interface IUtterancesProps {
  repo: string;
}

function Utterances({ repo }: IUtterancesProps): JSX.Element {
  const myRef = useRef();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const attrName = 'issue-term';
    const value = 'pathname';

    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://utteranc.es/client.js';
    scriptEl.async = true;
    scriptEl.setAttribute('repo', repo);
    scriptEl.setAttribute('theme', 'github-dark');
    scriptEl.setAttribute('crossorigin', 'anonymous');
    scriptEl.setAttribute(attrName, value);
    scriptEl.onload = () => setPending(false);
    if (myRef?.current) {
      myRef.current.appendChild(scriptEl);
    }
  }, [repo]);

  return (
    <div className="react-utterences" ref={myRef}>
      {pending && <div>Loading script...</div>}
    </div>
  );
}

export { Utterances };
