import { useEffect } from 'react';
import URLS from 'URLS';
import Helmet from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { urlEncode } from 'utils';
import { useNewsById } from 'api/hooks/News';
import { Box } from '@material-ui/core';

// Project components
import Http404 from 'containers/Http404';
import Page from 'components/navigation/Page';
import NewsRenderer, { NewsRendererLoading } from 'containers/NewsDetails/components/NewsRenderer';
import TIHLDELOGO from 'assets/img/TihldeBackground.jpg';

const NewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useNewsById(Number(id));

  useEffect(() => {
    if (data) {
      navigate(`${URLS.news}${id}/${urlEncode(data.title)}/`, { replace: true });
    }
  }, [id, navigate, data]);

  if (isError) {
    return <Http404 />;
  }

  return (
    <Page maxWidth={false} options={{ title: data ? data.title : 'Laster nyhet...' }}>
      {data && (
        <Helmet>
          <meta content={data.title} property='og:title' />
          <meta content='website' property='og:type' />
          <meta content={window.location.href} property='og:url' />
          <meta content={data.image || 'https://tihlde.org' + TIHLDELOGO} property='og:image' />
        </Helmet>
      )}
      <Box sx={{ pb: 2 }}>{isLoading ? <NewsRendererLoading /> : data !== undefined && <NewsRenderer data={data} />}</Box>
    </Page>
  );
};

export default NewsDetails;
