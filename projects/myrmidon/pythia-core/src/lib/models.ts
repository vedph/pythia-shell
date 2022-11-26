export interface Corpus {
  id: string;
  title: string;
  description: string;
  documentIds?: number[];
}

export interface Attribute {
  targetId: number;
  name: string;
  value: string;
}

export interface Profile {
  id: string;
  content?: string;
}

export interface Document {
  id: number;
  author: string;
  title: string;
  dateValue: number;
  sortKey: string;
  source: string;
  profileId: string;
  lastModified: Date;
  attributes: Attribute[];
  content?: string;
}

export interface IndexTerm {
  id: number;
  value: string;
  count: number;
}

export interface TextMapNode {
  label: string;
  location: string;
  start: number;
  end: number;
  selected?: boolean;
  children?: TextMapNode[];
  parent?: TextMapNode;
}

export interface DocumentReadRequest {
  documentId: number;
  start?: number;
  end?: number;
}
