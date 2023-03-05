import { QUERY_DOC_ATTR_DEFS } from '@myrmidon/pythia-query-builder';
import {
  QueryBuilderTermDef,
  QUERY_STRUCT_ATTR_DEFS,
  QUERY_TOK_ATTR_DEFS,
} from 'projects/myrmidon/pythia-query-builder/src/public-api';

/**
 * List of attributes come from:
 *
 * select distinct(name)
 * from document_attribute
 * order by name;
 * select distinct(name)
 * from occurrence_attribute
 * order by name;
 * select distinct(name)
 * from structure_attribute
 * order by name;
 */
export const ATTR_DEFS: QueryBuilderTermDef[] = [
  // document
  ...QUERY_DOC_ATTR_DEFS,
  {
    value: 'atto',
    label: 'act',
    group: 'document',
    document: true
  },
  {
    value: 'data',
    label: 'date',
    group: 'document',
    document: true
  },
  {
    value: 'giudicante',
    label: 'judge',
    group: 'document',
    document: true
  },
  {
    value: 'grado',
    label: 'degree',
    group: 'document',
    document: true
  },
  {
    value: 'gruppo-atto',
    label: 'doc. group',
    group: 'document',
    document: true
  },
  {
    value: 'gruppo-nr',
    label: 'group nr.',
    group: 'document',
    document: true
  },
  {
    value: 'id',
    label: 'ID',
    group: 'document',
    document: true
  },
  {
    value: 'materia',
    label: 'subject',
    group: 'document',
    document: true
  },
  {
    value: 'nascita-avv',
    label: 'birth year',
    group: 'document',
    tip: "Author's birth year.",
    document: true
  },
  {
    value: 'sede-giudicante',
    label: 'judgement place',
    group: 'document',
    document: true
  },
  {
    value: 'sede-raccolta',
    label: 'collection place',
    group: 'document',
    document: true
  },
  {
    value: 'sesso-avv',
    label: 'sex',
    group: 'document',
    tip: "Author's sex: M, F, X.",
    document: true
  },
  // occurrence
  ...QUERY_TOK_ATTR_DEFS,
  {
    value: 'abbr',
    label: 'abbreviation',
    group: 'token',
  },
  {
    value: 'address',
    label: 'address',
    group: 'token',
  },
  {
    value: 'b',
    label: 'bold',
    group: 'token',
  },
  {
    value: 'clitic',
    label: 'clitic',
    group: 'pos',
  },
  {
    value: 'definite',
    label: 'definite',
    group: 'pos',
  },
  {
    value: 'degree',
    label: 'degree',
    group: 'pos',
  },
  {
    value: 'deprel',
    label: 'deprel',
    group: 'pos',
  },
  {
    value: 'email',
    label: 'email',
    group: 'token',
  },
  {
    value: 'foreign',
    label: 'foreign',
    group: 'token',
  },
  {
    value: 'gender',
    label: 'gender',
    group: 'pos',
  },
  {
    value: 'i',
    label: 'italic',
    group: 'token',
  },
  {
    value: 'lemma',
    label: 'lemma',
    group: 'pos',
  },
  {
    value: 'len',
    label: 'length',
    group: 'token',
  },
  {
    value: 'mood',
    label: 'mood',
    group: 'pos',
  },
  {
    value: 'n',
    label: 'digits',
    group: 'token',
  },
  {
    value: 'number',
    label: 'number',
    group: 'pos',
  },
  {
    value: 'numtype',
    label: 'number type',
    group: 'pos',
  },
  {
    value: 'org-f',
    label: 'org.name, f.',
    group: 'token',
  },
  {
    value: 'org-m',
    label: 'org.name, m.',
    group: 'token',
  },
  {
    value: 'person',
    label: 'person',
    group: 'token',
  },
  {
    value: 'pn-f',
    label: 'person name, f.',
    group: 'token',
  },
  {
    value: 'pn-m',
    label: 'person name, m.',
    group: 'token',
  },
  {
    value: 'pn-s',
    label: 'surname',
    group: 'token',
  },
  {
    value: 'polarity',
    label: 'polarity',
    group: 'pos',
  },
  {
    value: 'poss',
    label: 'poss',
    group: 'pos',
  },
  {
    value: 'prontype',
    label: 'prontype',
    group: 'pos',
  },
  {
    value: 'tense',
    label: 'tense',
    group: 'pos',
  },
  {
    value: 'tn',
    label: 'toponym',
    group: 'token',
  },
  {
    value: 'upos',
    label: 'upos',
    group: 'pos',
  },
  {
    value: 'verbform',
    label: 'verbform',
    group: 'pos',
  },
  // structure
  ...QUERY_STRUCT_ATTR_DEFS,
  {
    value: 'p',
    label: 'paragraph',
    group: 'structure',
  },
];
