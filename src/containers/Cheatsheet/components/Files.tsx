import React from 'react';
import classnames from 'classnames';
import { CheatsheetType } from 'types/Enums';
import { Cheatsheet } from 'types/Types';

// Material UI Components
import { makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import { ReactComponent as GitHub } from 'assets/icons/github.svg';
import VerifiedIcon from '@material-ui/icons/VerifiedUserRounded';
import DocumentIcon from '@material-ui/icons/DescriptionRounded';
import LinkIcon from '@material-ui/icons/LinkRounded';
import OpenInNewIcon from '@material-ui/icons/OpenInNewRounded';

// Project Components
import Paper from 'components/layout/Paper';
import Pageination from 'components/layout/Pageination';

const useStyles = makeStyles((theme: Theme) => ({
  grid: {
    display: 'grid',
    width: '100%',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '26px 4fr 2fr 3fr',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '26px 1fr 1fr',
      gridGap: theme.spacing(1),
    },
  },
  filesHeaderContainer: {
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  filesHeader: {
    fontWeight: 'bold',
  },
  listItem: {
    marginBottom: 0,
    borderRadius: 0,
    border: 'none',
  },
  icon: {
    fill: theme.palette.colors.text.light,
    height: 26,
    width: 26,
  },
  verified: {
    fill: theme.palette.colors.status.green,
    height: 22,
    width: 22,
    margin: `auto 0 auto ${theme.spacing(0.5)}px`,
  },
  flex: {
    display: 'flex',
  },
}));

export type FilesProps = {
  files: Array<Cheatsheet>;
  nextPage: number | null;
  goToNextPage: () => void;
};

const Files = ({ files, nextPage, goToNextPage }: FilesProps) => {
  const classes = useStyles();
  const Icon = ({ cheatsheet }: { cheatsheet: Cheatsheet }) => {
    if (cheatsheet.type === CheatsheetType.FILE) {
      return (
        <Tooltip title='Fil'>
          <DocumentIcon className={classes.icon} />
        </Tooltip>
      );
    } else if (cheatsheet.type === CheatsheetType.GITHUB) {
      return (
        <Tooltip title='GitHub'>
          <GitHub className={classes.icon} />
        </Tooltip>
      );
    } else if (cheatsheet.type === CheatsheetType.LINK) {
      return (
        <Tooltip title='Link'>
          <LinkIcon className={classes.icon} />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title='Annet'>
          <OpenInNewIcon className={classes.icon} />
        </Tooltip>
      );
    }
  };

  return (
    <>
      <div className={classnames(classes.grid, classes.filesHeaderContainer)}>
        <div></div>
        <Typography className={classes.filesHeader} variant='subtitle1'>
          Tittel:
        </Typography>
        <Hidden mdDown>
          <Typography className={classes.filesHeader} variant='subtitle1'>
            Av:
          </Typography>
        </Hidden>
        <Typography className={classes.filesHeader} variant='subtitle1'>
          Fag:
        </Typography>
      </div>
      <Pageination fullWidth nextPage={goToNextPage} page={nextPage}>
        {files.length ? (
          <List aria-label='Filer'>
            {files.map((file, index) => (
              <React.Fragment key={index}>
                <Divider />
                <Paper className={classes.listItem} noPadding>
                  <ListItem button component='a' href={file.url} rel='noopener noreferrer' target='_blank'>
                    <div className={classes.grid}>
                      <Icon cheatsheet={file} />
                      <Typography variant='subtitle1'>
                        <strong>{file.title}</strong>
                      </Typography>
                      <Hidden mdDown>
                        <div className={classes.flex}>
                          <Typography variant='subtitle1'>{file.creator}</Typography>
                          {file.official && (
                            <Tooltip title='Laget av NTNU'>
                              <VerifiedIcon className={classnames(classes.icon, classes.verified)} />
                            </Tooltip>
                          )}
                        </div>
                      </Hidden>
                      <div className={classes.flex}>
                        <Typography variant='subtitle1'>{file.course}</Typography>
                        {file.official && (
                          <Hidden lgUp>
                            <Tooltip title='Laget av NTNU'>
                              <VerifiedIcon className={classnames(classes.icon, classes.verified)} />
                            </Tooltip>
                          </Hidden>
                        )}
                      </div>
                    </div>
                  </ListItem>
                </Paper>
                {index === files.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography align='center'>Fant ingen oppskrifter</Typography>
        )}
      </Pageination>
    </>
  );
};

export default Files;