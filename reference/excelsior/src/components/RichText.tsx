"use client";

import type { Media } from "@/payload-types";
import Image from "next/image";
import React from "react";

interface LexicalNode {
  type: string;
  version?: number;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  direction?: "ltr" | "rtl" | null;
  indent?: number;
  tag?: string;
  listType?: "bullet" | "number" | "check";
  value?: number | Media;
  url?: string;
  target?: string;
  rel?: string;
  fields?: {
    url?: string;
    linkType?: "custom" | "internal";
  };
  [key: string]: unknown;
}

interface RichTextProps {
  content:
    | {
        root: LexicalNode;
        [key: string]: unknown;
      }
    | null
    | undefined;
}

// Text format flags (Lexical uses bitmask)
const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;

function renderTextWithFormat(
  text: string,
  format: number | string | undefined
): React.ReactNode {
  if (!format || format === 0) return text;

  const formatNum = typeof format === "number" ? format : parseInt(format, 10);
  let element: React.ReactNode = text;

  if (formatNum & IS_CODE) {
    const cleanText = text.replace(/[`]/g, "");
    element = (
      <code className="not-prose bg-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono text-zinc-700 border border-zinc-200">
        {cleanText}
      </code>
    );
  }
  if (formatNum & IS_BOLD) {
    element = <strong>{element}</strong>;
  }
  if (formatNum & IS_ITALIC) {
    element = <em>{element}</em>;
  }
  if (formatNum & IS_UNDERLINE) {
    element = <u>{element}</u>;
  }
  if (formatNum & IS_STRIKETHROUGH) {
    element = <s>{element}</s>;
  }

  return element;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  const key = `${node.type}-${index}`;

  switch (node.type) {
    case "text":
      return (
        <React.Fragment key={key}>
          {renderTextWithFormat(node.text || "", node.format)}
        </React.Fragment>
      );

    case "paragraph":
      return (
        <p key={key}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case "heading": {
      const tag = node.tag || "h2";
      const children = node.children?.map((child, i) => renderNode(child, i));
      switch (tag) {
        case "h1":
          return <h1 key={key}>{children}</h1>;
        case "h2":
          return <h2 key={key}>{children}</h2>;
        case "h3":
          return <h3 key={key}>{children}</h3>;
        case "h4":
          return <h4 key={key}>{children}</h4>;
        case "h5":
          return <h5 key={key}>{children}</h5>;
        case "h6":
          return <h6 key={key}>{children}</h6>;
        default:
          return <h2 key={key}>{children}</h2>;
      }
    }

    case "quote":
      return (
        <blockquote key={key}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    case "list":
      if (node.listType === "number") {
        return (
          <ol key={key} start={typeof node.value === "number" ? node.value : 1}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </ol>
        );
      }
      return (
        <ul key={key}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ul>
      );

    case "listitem":
      return (
        <li key={key}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      );

    case "link":
    case "autolink":
      const href = node.fields?.url || node.url || "#";
      return (
        <a
          key={key}
          href={href}
          target={
            node.target || (href.startsWith("http") ? "_blank" : undefined)
          }
          rel={
            node.rel ||
            (href.startsWith("http") ? "noopener noreferrer" : undefined)
          }
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      );

    case "code":
      return (
        <pre
          key={key}
          className="bg-zinc-900 border border-zinc-800 p-4 overflow-x-auto rounded"
        >
          <code className="text-sm font-mono text-zinc-300">
            {node.children?.map((child, i) => renderNode(child, i))}
          </code>
        </pre>
      );

    case "horizontalrule":
      return <hr key={key} className="border-zinc-700 my-8" />;

    case "linebreak":
      return <br key={key} />;

    case "upload": {
      const media =
        typeof node.value === "object" ? (node.value as Media | null) : null;
      if (!media || !media.url) return null;

      return (
        <div
          key={key}
          className="not-prose my-8 rounded-lg overflow-hidden border border-zinc-200 shadow-md"
        >
          <Image
            src={media.url}
            alt={media.alt || ""}
            width={media.width || 1200}
            height={media.height || 675}
            className="w-full h-auto object-cover"
          />
          {media.caption && (
            <div className="bg-zinc-50 px-4 py-2 border-t border-zinc-100">
              <p className="text-sm text-zinc-500 italic">{media.caption}</p>
            </div>
          )}
        </div>
      );
    }

    case "root":
      return (
        <React.Fragment key={key}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </React.Fragment>
      );

    default:
      // For unknown types, try to render children if they exist
      if (node.children && node.children.length > 0) {
        return (
          <div key={key}>
            {node.children.map((child, i) => renderNode(child, i))}
          </div>
        );
      }
      // If there's text, render it
      if (node.text) {
        return <span key={key}>{node.text}</span>;
      }
      return null;
  }
}

export default function RichText({ content }: RichTextProps) {
  if (!content || !content.root) {
    return null;
  }

  return <div className="rich-text">{renderNode(content.root, 0)}</div>;
}
