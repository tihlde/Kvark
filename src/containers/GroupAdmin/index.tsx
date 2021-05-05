import { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import { MembershipType } from 'types/Enums';
import { useGroup } from 'api/hooks/Group';
import { useMemberships } from 'api/hooks/Membership';

// Material UI
import { makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

// Project components
import Http404 from 'containers/Http404';
import Navigation from 'components/navigation/Navigation';
import Banner from 'components/layout/Banner';
import Paper from 'components/layout/Paper';
import UpdateGroupModal from 'containers/GroupAdmin/components/UpdateGroupModal';
import MemberListItem from 'containers/GroupAdmin/components/MemberListItem';
import AddMemberModal from 'containers/GroupAdmin/components/AddMemberModal';
import MembersCard from 'containers/Pages/specials/Index/MembersCard';
import Pagination from 'components/layout/Pagination';
import { group } from 'console';

const useStyles = makeStyles((theme) => ({
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  list: {
    display: 'grid',
    gap: theme.spacing(1),
  },
}));

const Group = () => {
  const classes = useStyles();
  const { slug: slugParameter } = useParams();
  const slug = slugParameter.toLowerCase();

  const filters = { onlyMembers: true };
  const { data: membersData, error, hasNextPage, fetchNextPage, isLoading: isLoadingMembers, isFetching } = useMemberships(slug, filters);
  const { data, isLoading: isLoadingGroups, isError } = useGroup(slug);

  const hasWriteAcccess = Boolean(data?.permissions.write);

  if (isError) {
    return <Http404 />;
  }

  if (isLoadingGroups || !data) {
    return <Navigation isLoading />;
  }

  return (
    <Navigation
      banner={
        <Banner text={`${data.description} \n${data.contact_email ? `Kontakt: ${data.contact_email}` : ''}`} title={data.name}>
          {hasWriteAcccess && <UpdateGroupModal group={data} />}
        </Banner>
      }
      fancyNavbar>
      <Helmet>
        <title>{data.name}</title>
      </Helmet>
      {isLoadingMembers ? (
        <Paper className={classnames(classes.gutterBottom, classes.list)}>
          <Skeleton height={45} width={160} />
          <Skeleton width={120} />
          <Skeleton height={45} width={190} />
          <Skeleton width={140} />
          <Skeleton width={150} />
          <Skeleton width={130} />
          <Skeleton width={160} />
        </Paper>
      ) : (
        <>
          {hasWriteAcccess ? (
            <Paper className={classes.gutterBottom}>
              {data?.leader && (
                <>
                  <Typography gutterBottom variant='h3'>
                    Leder:{' '}
                    <b>
                      {data.leader.first_name} {data.leader.last_name}{' '}
                    </b>{' '}
                  </Typography>
                </>
              )}
              <Typography gutterBottom variant='h3'>
                Medlemmer:
              </Typography>
              <div className={classes.list}>
                <AddMemberModal groupSlug={slug} />
                <Pagination fullWidth hasNextPage={hasNextPage} isLoading={isFetching} nextPage={() => fetchNextPage()}>
                  {membersData?.pages.map((page, i) => (
                    <Fragment key={i}>
                      {page.results.map((member) => (
                        <MemberListItem key={member.user.user_id} slug={slug} user={member.user} />
                      ))}
                    </Fragment>
                  ))}
                </Pagination>
              </div>
            </Paper>
          ) : (
            <MembersCard slug={slug} />
          )}
        </>
      )}
    </Navigation>
  );
};

export default Group;
