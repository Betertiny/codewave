'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const isInline = !match && !className;

    if (isInline) {
      return (
        <code
          className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-700"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <SyntaxHighlighter
        // @ts-ignore
        style={vscDarkPlus}
        language={match ? match[1] : 'text'}
        PreTag="div"
        className="text-sm !bg-[#1e1e1e] rounded-xl my-6 overflow-hidden shadow-xl"
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.7',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  },
  a({ href, children, ...props }) {
    return (
      <a
        href={href}
        className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-2 decoration-primary-500/50 hover:decoration-primary-500 transition-all"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  img({ src, alt, ...props }) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className="rounded-xl my-6 max-w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        loading="lazy"
        {...props}
      />
    );
  },
  h1({ children, ...props }) {
    return (
      <h1 className="text-3xl font-bold mt-10 mb-5 text-gray-900 dark:text-white font-space" {...props}>
        {children}
      </h1>
    );
  },
  h2({ children, ...props }) {
    return (
      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white font-space" {...props}>
        {children}
      </h2>
    );
  },
  h3({ children, ...props }) {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white font-space" {...props}>
        {children}
      </h3>
    );
  },
  p({ children, ...props }) {
    return (
      <p className="mb-5 text-base leading-8 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </p>
    );
  },
  ul({ children, ...props }) {
    return (
      <ul className="mb-5 pl-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ul>
    );
  },
  ol({ children, ...props }) {
    return (
      <ol className="mb-5 pl-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ol>
    );
  },
  li({ children, ...props }) {
    return (
      <li className="text-base leading-relaxed" {...props}>
        {children}
      </li>
    );
  },
  blockquote({ children, ...props }) {
    return (
      <blockquote 
        className="border-l-4 border-primary-500 pl-5 py-3 my-6 bg-primary-50/50 dark:bg-primary-900/10 rounded-r-xl text-gray-600 dark:text-gray-400 italic"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  hr({ ...props }) {
    return (
      <hr className="my-10 border-gray-200 dark:border-gray-700" {...props} />
    );
  },
  table({ children, ...props }) {
    return (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm" {...props}>
          {children}
        </table>
      </div>
    );
  },
  th({ children, ...props }) {
    return (
      <th className="bg-gray-100 dark:bg-gray-800 font-semibold px-5 py-3 text-left text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </th>
    );
  },
  td({ children, ...props }) {
    return (
      <td className="px-5 py-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700" {...props}>
        {children}
      </td>
    );
  },
  strong({ children, ...props }) {
    return (
      <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
        {children}
      </strong>
    );
  },
};

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
