type LexicalNode = Record<string, unknown>

function makeTextNode(text: string, format = 0): LexicalNode {
  return {
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  }
}

function makeParagraph(text: string): LexicalNode {
  return {
    children: text.trim() ? [makeTextNode(text.trim())] : [],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  }
}

function makeHeading(text: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode {
  return {
    children: [makeTextNode(text.trim())],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    type: 'heading',
    version: 1,
  }
}

function makeListItem(text: string): LexicalNode {
  return {
    children: [
      {
        children: [makeTextNode(text.trim())],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'listitem',
    value: 1,
    version: 1,
  }
}

function makeList(items: string[]): LexicalNode {
  return {
    children: items.map(makeListItem),
    direction: 'ltr',
    format: '',
    indent: 0,
    listType: 'bullet',
    start: 1,
    tag: 'ul',
    type: 'list',
    version: 1,
  }
}

function stripMarkdownFormatting(line: string) {
  return line
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
}

export function markdownToLexical(markdown: string) {
  const lines = markdown.split('\n')
  const nodes: LexicalNode[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.startsWith('## ')) {
      nodes.push(makeHeading(line.slice(3)))
      index += 1
      continue
    }

    if (line.startsWith('### ')) {
      nodes.push(makeHeading(line.slice(4), 'h3'))
      index += 1
      continue
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = []

      while (
        index < lines.length &&
        (lines[index].startsWith('- ') || lines[index].startsWith('* '))
      ) {
        items.push(stripMarkdownFormatting(lines[index].slice(2)))
        index += 1
      }

      nodes.push(makeList(items))
      continue
    }

    if (!line.trim()) {
      index += 1
      continue
    }

    const parts: string[] = []

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith('#') &&
      !lines[index].startsWith('- ') &&
      !lines[index].startsWith('* ')
    ) {
      parts.push(stripMarkdownFormatting(lines[index]))
      index += 1
    }

    if (parts.length > 0) {
      nodes.push(makeParagraph(parts.join(' ')))
    }
  }

  return {
    root: {
      children: nodes.length > 0 ? nodes : [makeParagraph('')],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}
