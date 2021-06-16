import { useState, lazy, Suspense } from 'react';

// Material-UI
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Collapse from '@material-ui/core/Collapse';

// Project componets/services
import { useEvents } from 'api/hooks/Event';
import EventsListView from 'containers/Landing/components/EventsListView';

// Icons
import Reorder from '@material-ui/icons/ReorderRounded';
import DateRange from '@material-ui/icons/DateRangeRounded';

const EventsCalendarView = lazy(() => import(/* webpackChunkName: "events_calendar" */ 'containers/Landing/components/EventsCalendarView'));

enum Views {
  LIST,
  CALENDAR,
}

const EventsView = () => {
  const { data, isLoading } = useEvents();
  const { data: oldEvents } = useEvents({ expired: true });
  const [tab, setTab] = useState(Views.LIST);

  return (
    <>
      <Tabs centered onChange={(e, newTab) => setTab(newTab as Views)} value={tab}>
        <Tab icon={<Reorder />} label='Listevisning' />
        <Tab icon={<DateRange />} label='Kalendervisning' />
      </Tabs>
      <Collapse in={tab === Views.LIST}>
        <EventsListView events={data?.pages[0]?.results || []} isLoading={isLoading} />
      </Collapse>
      <Collapse in={tab === Views.CALENDAR} mountOnEnter>
        <Suspense fallback={null}>
          <EventsCalendarView events={data?.pages[0]?.results || []} oldEvents={oldEvents?.pages[0]?.results || []} />
        </Suspense>
      </Collapse>
    </>
  );
};

export default EventsView;
