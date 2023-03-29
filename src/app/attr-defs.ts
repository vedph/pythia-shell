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
    label: $localize`act`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Act\'s category (e.g. "ricorso al tar")`,
  },
  {
    value: 'data',
    label: $localize`date`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Act's date in the form YYYYMMDD.`,
  },
  {
    value: 'giudicante',
    label: $localize`judge`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Judging body (e.g. "corte di appello").`,
  },
  {
    value: 'grado',
    label: $localize`degree`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Judgement degree: "1", "2", "3".`,
  },
  {
    value: 'gruppo-atto',
    label: $localize`doc. group`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Arbitrary ID to group acts together.`,
  },
  {
    value: 'gruppo-nr',
    label: $localize`group nr.`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`The ordinal number of a grouped act.`,
  },
  {
    value: 'id',
    label: $localize`ID`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Document numeric ID.`,
    hidden: true,
  },
  {
    value: 'materia',
    label: $localize`subject`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: 'Act\'s subject (e.g. "civile").',
  },
  {
    value: 'nascita-avv',
    label: $localize`birth year`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Author's birth year.`,
  },
  {
    value: 'sede-giudicante',
    label: $localize`judgement place`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Judgement place (e.g. "Firenze").`,
  },
  {
    value: 'sede-raccolta',
    label: $localize`collection place`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Collection place: "fi" or "ge".`,
  },
  {
    value: 'sesso-avv',
    label: $localize`sex`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Author\'s sex: "M", "F", "X".`,
  },
  // token
  ...QUERY_TOK_ATTR_DEFS,
  {
    value: 'abbr',
    label: $localize`abbreviation`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Abbreviation: "1" if an abbreviation.`,
  },
  {
    value: 'address',
    label: $localize`address`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Address.`,
  },
  {
    value: 'b',
    label: $localize`bold`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Bold: "1" if bold.`,
  },
  {
    value: 'clitic',
    label: $localize`clitic`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Clitic: "yes" if clitic.`,
  },
  {
    value: 'definite',
    label: $localize`definite`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Definite: "def"inite or "ind"efinite.`,
  },
  {
    value: 'degree',
    label: $localize`degree`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Degree: "abs"olute or "cmp"=comparative.`,
  },
  {
    value: 'deprel',
    label: $localize`deprel`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Universal dependency relation.`,
  },
  {
    value: 'email',
    label: $localize`email`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
  },
  {
    value: 'foreign',
    label: $localize`foreign`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Foreign word: ISO-639/3 language code (e.g. "eng").`
  },
  {
    value: 'gender',
    label: $localize`gender`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Gender: "masc"uline or "fem"inine.`,
  },
  {
    value: 'i',
    label: $localize`italic`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Italic: "1" if italic.`,
  },
  {
    value: 'lp',
    label: $localize`left punctuation`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Left punctuation(s).`,
  },
  {
    value: 'rp',
    label: $localize`right punctuation`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Right punctuation(s).`,
  },
  // {
  //   value: 'len',
  //   label: $localize`length`,
  //   type: QueryBuilderTermType.Token,
  //   group: $localize`token`,
  //   tip: $localize`Word's length in letters.`,
  // },
  {
    value: 'lemma',
    label: $localize`lemma`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`The paradigmatic form of a word.`,
  },
  {
    value: 'mood',
    label: $localize`mood`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Mood: "cnd"=conditional, "imp"erative, "ind"icative, "sub"junctive.`,
  },
  {
    value: 'n',
    label: $localize`digits`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Digits: "1" if digit(s).`,
  },
  {
    value: 'number',
    label: $localize`number`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Number: "sing"ular or "plur"al.`,
  },
  {
    value: 'numtype',
    label: $localize`number type`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Number type: "ord"inal, "card"inal.`,
  },
  {
    value: 'org-f',
    label: $localize`org.name, f.`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Female juridic person name.`,
  },
  {
    value: 'org-m',
    label: $localize`org.name, m.`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Male juridic person name.`,
  },
  {
    value: 'person',
    label: $localize`person`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Person: "1", "2", "3".`,
  },
  {
    value: 'pn-f',
    label: $localize`person name, f.`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Female person name.`,
  },
  {
    value: 'pn-m',
    label: $localize`person name, m.`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Male person name.`,
  },
  {
    value: 'pn-s',
    label: $localize`surname`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Person's surname.`,
  },
  {
    value: 'polarity',
    label: $localize`polarity`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Polarity: "pos"itive or "neg"ative.`,
  },
  {
    value: 'poss',
    label: $localize`poss`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Possessive: "yes".`,
  },
  {
    value: 'prontype',
    label: $localize`prontype`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Pronoun type: "art", "dem", "exc", "ind", "int", "neg", "prs", "rel", "tot".`,
  },
  {
    value: 'tense',
    label: $localize`tense`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Tense: "fut"ure, "imp"erfect, "past", "pres"ent.`,
  },
  {
    value: 'tn',
    label: $localize`toponym`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Place name.`,
  },
  {
    value: 'upos',
    label: $localize`upos`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`UDP part of speech: "ADJ", "ADP", "ADV", "AUX", "CCONJ", "DET", "INTJ", "NOUN", "NUM", "PRON", "PROPN", "PUNCT", "SCONJ", "SYM", "VERB", "X".`,
  },
  {
    value: 'verbform',
    label: $localize`verbform`,
    type: QueryBuilderTermType.Token,
    group: 'pos',
    tip: $localize`Verbal form: "fin"ite, "ger"und, "inf"inite, "part"iciple.`,
  },
  // structure
  ...QUERY_STRUCT_ATTR_DEFS,
  {
    value: 'p',
    label: $localize`paragraph`,
    type: QueryBuilderTermType.Structure,
    group: $localize`structure`,
    tip: $localize`Paragraph: "1" if a paragraph.`,
  },
];
