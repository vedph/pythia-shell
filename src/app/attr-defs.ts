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
    document: true,
  },
  {
    value: 'data',
    label: 'date',
    group: 'document',
    document: true,
  },
  {
    value: 'giudicante',
    label: 'judge',
    group: 'document',
    document: true,
  },
  {
    value: 'grado',
    label: 'degree',
    group: 'document',
    document: true,
  },
  {
    value: 'gruppo-atto',
    label: 'doc. group',
    group: 'document',
    document: true,
  },
  {
    value: 'gruppo-nr',
    label: 'group nr.',
    group: 'document',
    document: true,
  },
  {
    value: 'id',
    label: 'ID',
    group: 'document',
    document: true,
  },
  {
    value: 'materia',
    label: 'subject',
    group: 'document',
    document: true,
  },
  {
    value: 'nascita-avv',
    label: 'birth year',
    group: 'document',
    tip: "Author's birth year.",
    document: true,
  },
  {
    value: 'sede-giudicante',
    label: 'judgement place',
    group: 'document',
    document: true,
  },
  {
    value: 'sede-raccolta',
    label: 'collection place',
    group: 'document',
    document: true,
  },
  {
    value: 'sesso-avv',
    label: 'sex',
    group: 'document',
    tip: "Author's sex: M, F, X.",
    document: true,
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
    tip: 'Clitic: "yes" if clitic.',
  },
  {
    value: 'definite',
    label: 'definite',
    group: 'pos',
    tip: 'Definite: "def"inite or "ind"efinite.',
  },
  {
    value: 'degree',
    label: 'degree',
    group: 'pos',
    tip: 'Degree: "abs"olute or "cmp"=comparative.',
  },
  {
    value: 'deprel',
    label: 'deprel',
    group: 'pos',
    tip: 'Universal dependency relation.',
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
    tip: 'Gender: "masc"uline or "fem"inine.',
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
    tip: 'Mood: "cnd"=conditional, "imp"erative, "ind"icative, "sub"junctive.',
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
    tip: 'Number: "sing"ular or "plur"al.',
  },
  {
    value: 'numtype',
    label: 'number type',
    group: 'pos',
    tip: 'Number type: "ord"inal, "card"inal.',
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
    tip: 'Polarity: "pos"itive or "neg"ative.',
  },
  {
    value: 'poss',
    label: 'poss',
    group: 'pos',
    tip: 'Possessive: "yes".',
  },
  {
    value: 'prontype',
    label: 'prontype',
    group: 'pos',
    tip: 'Pronoun type: "art", "dem", "exc", "ind", "int", "neg", "prs", "rel", "tot".',
  },
  {
    value: 'tense',
    label: 'tense',
    group: 'pos',
    tip: 'Tense: "fut"ure, "imp"erfect, "past", "pres"ent.',
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
    tip: 'UDP part of speech: "ADJ", "ADP", "ADV", "AUX", "CCONJ", "DET", "INTJ", "NOUN", "NUM", "PRON", "PROPN", "PUNCT", "SCONJ", "SYM", "VERB", "X".',
  },
  {
    value: 'verbform',
    label: 'verbform',
    group: 'pos',
    tip: 'Verbal form: "fin"ite, "ger"und, "inf"inite, "part"iciple.'
  },
  // structure
  ...QUERY_STRUCT_ATTR_DEFS,
  {
    value: 'p',
    label: 'paragraph',
    group: 'structure',
  },
];
