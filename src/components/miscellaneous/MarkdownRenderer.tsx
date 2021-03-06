/* eslint-disable react/display-name */
import { createElement, useMemo, ReactNode, lazy, Suspense } from 'react';
import { useEventById } from 'api/hooks/Event';
import { useJobPostById } from 'api/hooks/JobPost';
import { useNewsById } from 'api/hooks/News';

// Material UI
import { makeStyles } from '@material-ui/styles';
import { Divider, Typography, Skeleton } from '@material-ui/core';

// Project components
import Expansion from 'components/layout/Expand';
import ListItem, { ListItemLoading } from 'components/miscellaneous/ListItem';

const ReactMarkdown = lazy(() => import('react-markdown'));
const MuiLinkify = lazy(() => import('material-ui-linkify'));

const useStyles = makeStyles((theme) => ({
  blockquote: {
    margin: theme.spacing(0, 2, 1),
    padding: theme.spacing(2, 3, 1),
    borderLeft: `${theme.spacing(1)} solid ${theme.palette.primary.main}`,
  },
  code: {
    color: theme.palette.text.primary,
    background: theme.palette.action.selected,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    overflowX: 'auto',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  inlineCode: {
    padding: theme.spacing(0.5, 1),
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    background: theme.palette.action.selected,
  },
  list: {
    listStylePosition: 'inside',
    marginLeft: theme.spacing(1),
  },
  listItem: {
    fontSize: theme.typography.body1.fontSize,
  },
  content: {
    marginBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    overflowWrap: 'anywhere',
    '@supports not (overflow-wrap: anywhere)': {
      hyphens: 'auto',
    },
  },
  expansion: {
    border: `1px solid ${theme.palette.divider}`,
    background: theme.palette.background.smoke,
  },
  image: {
    maxWidth: '100%',
    objectFit: 'contain',
    height: 'auto',
    borderRadius: theme.shape.borderRadius,
  },
}));

export type MarkdownRendererProps = {
  value?: string;
};

const MarkdownRenderer = ({ value }: MarkdownRendererProps) => {
  const classes = useStyles();

  type ComponentProps = {
    id: number;
  };

  const Event = ({ id }: ComponentProps) => {
    const { data } = useEventById(id);
    return data ? <ListItem className={classes.content} event={data} largeImg /> : <ListItemLoading />;
  };
  const JobPost = ({ id }: ComponentProps) => {
    const { data } = useJobPostById(id);
    return data ? <ListItem className={classes.content} jobpost={data} largeImg /> : <ListItemLoading />;
  };
  const News = ({ id }: ComponentProps) => {
    const { data } = useNewsById(id);
    return data ? <ListItem className={classes.content} largeImg news={data} /> : <ListItemLoading />;
  };

  enum LanguageTypes {
    EXPANDLIST = 'expandlist',
    EXPAND = 'expand',
    EVENT = 'event',
    JOBPOST = 'jobpost',
    NEWS = 'news',
  }

  type CodeBlockProps = {
    language: LanguageTypes | string;
    value: string;
  };
  const CodeBlock = ({ language, value }: CodeBlockProps) => {
    if (language === LanguageTypes.EXPANDLIST) {
      return (
        <div className={classes.content}>
          <ReactMarkdown renderers={renderers}>{value}</ReactMarkdown>
        </div>
      );
    } else if (language === LanguageTypes.EXPAND) {
      const header = value.split('::')[0] || '';
      const children = value.split('::')[1] || '';
      return (
        <Expansion className={classes.expansion} flat header={header}>
          <ReactMarkdown renderers={renderers}>{children}</ReactMarkdown>
        </Expansion>
      );
    } else if (language === LanguageTypes.EVENT || language === LanguageTypes.JOBPOST || language === LanguageTypes.NEWS) {
      const id = Number(value);
      if (!Number.isInteger(id)) {
        return null;
      } else if (language === LanguageTypes.EVENT) {
        return <Event id={id} />;
      } else if (language === LanguageTypes.JOBPOST) {
        return <JobPost id={id} />;
      } else if (language === LanguageTypes.NEWS) {
        return <News id={id} />;
      }
    }
    return createElement('pre', { className: classes.code }, createElement('code', {}, value));
  };

  const renderers = useMemo(
    () => ({
      blockquote: ({ children }: { children: ReactNode[] }) => createElement('blockquote', { className: classes.blockquote }, children),
      code: CodeBlock,
      heading: ({ level, children }: { level: number; children: ReactNode[] }) =>
        createElement(Typography, { variant: level === 1 ? 'h2' : 'h3', className: classes.content }, children),
      inlineCode: ({ value }: { value: string }) => createElement('code', { className: classes.inlineCode }, value),
      list: ({ children, ordered }: { children: ReactNode[]; ordered: boolean }) => createElement(ordered ? 'ol' : 'ul', { className: classes.list }, children),
      listItem: ({ children, checked }: { children: ReactNode[]; checked: boolean }) =>
        createElement('li', { className: classes.listItem }, checked ? createElement('input', { type: 'checkbox', checked, readOnly: true }) : null, children),
      paragraph: ({ children }: { children: ReactNode[] }) =>
        createElement(
          MuiLinkify,
          { LinkProps: { color: 'inherit', underline: 'always' } },
          createElement(Typography, { variant: 'body1', className: classes.content }, children),
        ),
      thematicBreak: () => <Divider className={classes.divider} />,
      image: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} className={classes.image} src={src} />,
    }),
    [classes],
  );
  const skeletonWidthArray = useMemo(() => Array.from({ length: (value?.length || 100) / 90 + 1 }).map(() => 50 + 40 * Math.random()), [value]);

  return (
    <Suspense
      fallback={
        <>
          {skeletonWidthArray.map((width, index) => (
            <Skeleton height={38} key={index} width={`${width}%`} />
          ))}
        </>
      }>
      <ReactMarkdown renderers={renderers}>{value || ''}</ReactMarkdown>
    </Suspense>
  );
};

export default MarkdownRenderer;
