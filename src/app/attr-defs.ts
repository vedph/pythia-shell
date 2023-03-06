import { QUERY_DOC_ATTR_DEFS } from '@myrmidon/pythia-query-builder';
import {
  QueryBuilderTermDef,
  QueryBuilderTermType,
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
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Act\'s category (e.g. "ricorso al tar")',
  },
  {
    value: 'data',
    label: 'date',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: "Act's date in the form YYYYMMDD.",
  },
  {
    value: 'giudicante',
    label: 'judge',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Judging body (e.g. "corte di appello").',
  },
  {
    value: 'grado',
    label: 'degree',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Judgement degree: "1", "2", "3".',
  },
  {
    value: 'gruppo-atto',
    label: 'doc. group',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Act\'s working group.'
  },
  {
    value: 'gruppo-nr',
    label: 'group nr.',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Act\'s group number.'
  },
  {
    value: 'id',
    label: 'ID',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Document numeric ID.',
    hidden: true
  },
  {
    value: 'materia',
    label: 'subject',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Act\'s subject (e.g. "civile").'
  },
  {
    value: 'nascita-avv',
    label: 'birth year',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: "Author's birth year.",
  },
  {
    value: 'sede-giudicante',
    label: 'judgement place',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Judgement place (e.g. "Firenze").'
  },
  {
    value: 'sede-raccolta',
    label: 'collection place',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Collection place: "fi" or "ge".',
  },
  {
    value: 'sesso-avv',
    label: 'sex',
    type: QueryBuilderTermType.Document,
    group: 'document',
    tip: 'Author\'s sex: "M", "F", "X".',
  },
  // token
  ...QUERY_TOK_ATTR_DEFS,
  {
    value: 'abbr',
    label: 'abbreviation',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Abbreviation: "1" if an abbreviation.'
  },
  {
    value: 'address',
    label: 'address',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Address.'
  },
  {
    value: 'b',
    label: 'bold',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Bold: "1" if bold.',
  },
  {
    value: 'clitic',
    label: 'clitic',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Clitic: "yes" if clitic.',
  },
  {
    value: 'definite',
    label: 'definite',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Definite: "def"inite or "ind"efinite.',
  },
  {
    value: 'degree',
    label: 'degree',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Degree: "abs"olute or "cmp"=comparative.',
  },
  {
    value: 'deprel',
    label: 'deprel',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Universal dependency relation.',
  },
  {
    value: 'email',
    label: 'email',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'foreign',
    label: 'foreign',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'gender',
    label: 'gender',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Gender: "masc"uline or "fem"inine.',
  },
  {
    value: 'i',
    label: 'italic',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'lemma',
    label: 'lemma',
    type: QueryBuilderTermType.Token,
    group: 'pos',
  },
  {
    value: 'len',
    label: 'length',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'mood',
    label: 'mood',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Mood: "cnd"=conditional, "imp"erative, "ind"icative, "sub"junctive.',
  },
  {
    value: 'n',
    label: 'digits',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Digits: "1" if digit(s).'
  },
  {
    value: 'number',
    label: 'number',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Number: "sing"ular or "plur"al.',
  },
  {
    value: 'numtype',
    label: 'number type',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Number type: "ord"inal, "card"inal.',
  },
  {
    value: 'org-f',
    label: 'org.name, f.',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Female juridic person name.'
  },
  {
    value: 'org-m',
    label: 'org.name, m.',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Male juridic person name.'
  },
  {
    value: 'person',
    label: 'person',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Person: "1", "2", "3".'
  },
  {
    value: 'pn-f',
    label: 'person name, f.',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Female person name.'
  },
  {
    value: 'pn-m',
    label: 'person name, m.',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Male person name.'
  },
  {
    value: 'pn-s',
    label: 'surname',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Surname.'
  },
  {
    value: 'polarity',
    label: 'polarity',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Polarity: "pos"itive or "neg"ative.',
  },
  {
    value: 'poss',
    label: 'poss',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Possessive: "yes".',
  },
  {
    value: 'prontype',
    label: 'prontype',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Pronoun type: "art", "dem", "exc", "ind", "int", "neg", "prs", "rel", "tot".',
  },
  {
    value: 'tense',
    label: 'tense',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Tense: "fut"ure, "imp"erfect, "past", "pres"ent.',
  },
  {
    value: 'tn',
    label: 'toponym',
    type: QueryBuilderTermType.Token,
    group: 'token',
    tip: 'Toponym.'
  },
  {
    value: 'upos',
    label: 'upos',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'UDP part of speech: "ADJ", "ADP", "ADV", "AUX", "CCONJ", "DET", "INTJ", "NOUN", "NUM", "PRON", "PROPN", "PUNCT", "SCONJ", "SYM", "VERB", "X".',
  },
  {
    value: 'verbform',
    label: 'verbform',
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: 'Verbal form: "fin"ite, "ger"und, "inf"inite, "part"iciple.',
  },
  // structure
  ...QUERY_STRUCT_ATTR_DEFS,
  {
    value: 'p',
    label: 'paragraph',
    type: QueryBuilderTermType.Structure,
    group: 'structure',
    tip: 'Paragraph: "1" if a paragraph.'
  },
];
