"use client";

import ReactMarkdown from 'react-markdown';

type Props = {
  content: string;
};

export function MarkdownContent({ content }: Props) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}

