import { marked } from "marked";

// Types
interface Section {
  _content: string;
  [title: string]: Section | string;
}

interface Token {
  type: string;
  depth?: number;
  text?: string;
  raw?: string;
}

interface ParserState {
  currentSection: Section;
  sectionStack: Section[];
  currentDepth: number;
  content: string[];
}

function createInitialState(): ParserState {
  return {
    currentSection: { _content: "" },
    sectionStack: [{ _content: "" }],
    currentDepth: 0,
    content: [],
  };
}

function handleHeader(state: ParserState, token: Token): ParserState {
  const depth = token.depth || 0;
  const title = token.text || "";

  let newStack = [...state.sectionStack];
  if (depth <= state.currentDepth) {
    const levelsUp = state.currentDepth - depth + 1;
    newStack = newStack.slice(0, -levelsUp);
  }

  const newSection: Section = { _content: "" };
  const currentParent = newStack[newStack.length - 1];
  currentParent[title] = newSection;

  return {
    ...state,
    sectionStack: [...newStack, newSection],
    currentDepth: depth,
    content: [],
  };
}
function normalizeContent(raw: string, type: string = "text"): string {
  // First convert all line endings to \n
  let content = raw.replace(/\r\n/g, "\n");

  // For code blocks, only trim trailing/leading blank lines but preserve indentation
  if (type === "code") {
    return content.replace(/^\n+|\n+$/g, "");
  }

  // Remove trailing/leading whitespace from the whole content
  content = content.trim();

  // Handle list items differently from paragraphs
  if (content.includes("\n- ")) {
    // For list items, keep the exact format
    return content;
  }

  // For paragraphs, ensure exactly one blank line between them
  return content
    .split(/\n+/)
    .map((p) => p.trim())
    .join("\n\n");
}
function handleContent(state: ParserState, token: Token): ParserState {
  if (!token.raw) return state;

  const normalized = normalizeContent(token.raw, token.type);
  if (!normalized) return state;

  const newStack = [...state.sectionStack];
  const currentSection = newStack[newStack.length - 1];

  if (state.content.length === 0) {
    currentSection._content = normalized;
  } else {
    // If there's already content, we need to decide how to join it
    const existingContent = currentSection._content;
    if (normalized.startsWith("- ") || token.type === "code") {
      // For lists and code blocks, preserve the exact format
      currentSection._content = existingContent + "\n" + normalized;
    } else {
      // For paragraphs, ensure double newlines
      currentSection._content = existingContent + "\n\n" + normalized;
    }
  }

  return {
    ...state,
    content: [...state.content, normalized],
    sectionStack: newStack,
  };
}

export function mdToJson(markdown: string): Section {
  const normalizedMarkdown = markdown.replace(/\r\n/g, "\n");
  const tokens = marked.lexer(normalizedMarkdown);

  const finalState = tokens.reduce((state: ParserState, token: Token) => {
    if (token.type === "heading") {
      return handleHeader(state, token);
    } else {
      return handleContent(state, token);
    }
  }, createInitialState());

  return finalState.sectionStack[0];
}
