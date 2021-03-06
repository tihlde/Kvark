import { useCallback, useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Event, RegistrationPriority } from 'types/Types';
import { useEventById, useCreateEvent, useUpdateEvent, useDeleteEvent } from 'api/hooks/Event';
import { useCategories } from 'api/hooks/Categories';
import { useSnackbar } from 'api/hooks/Snackbar';
import { addHours, subDays, parseISO, setHours, startOfHour } from 'date-fns';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { Button, Grid, MenuItem, Collapse, Accordion, AccordionSummary, AccordionDetails, Typography, LinearProgress } from '@material-ui/core';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';

// Project components
import EventFormEditor from 'containers/EventAdministration/components/EventFormEditor';
import EventRegistrationPriorities from 'containers/EventAdministration/components/EventRegistrationPriorities';
import EventRenderer from 'containers/EventDetails/components/EventRenderer';
import Dialog from 'components/layout/Dialog';
import MarkdownEditor from 'components/inputs/MarkdownEditor';
import Select from 'components/inputs/Select';
import Bool from 'components/inputs/Bool';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import DatePicker from 'components/inputs/DatePicker';
import { ImageUpload } from 'components/inputs/Upload';
import RendererPreview from 'components/miscellaneous/RendererPreview';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(2),
    gridTemplateColumns: '1fr 1fr',
    [theme.breakpoints.down('md')]: {
      gridGap: 0,
      gridTemplateColumns: '1fr',
    },
  },
  margin: {
    margin: theme.spacing(2, 0, 1),
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
  },
  expansionPanel: {
    border: '1px solid ' + theme.palette.divider,
    background: theme.palette.background.smoke,
  },
}));

export type EventEditorProps = {
  eventId: number | null;
  goToEvent: (newEvent: number | null) => void;
};

type FormValues = Pick<
  Event,
  'category' | 'description' | 'evaluate_link' | 'image' | 'image_alt' | 'limit' | 'location' | 'priority' | 'sign_up' | 'title'
> & {
  end_date: Date;
  end_registration_at: Date;
  sign_off_deadline: Date;
  start_date: Date;
  start_registration_at: Date;
};

const priorities = ['Lav', 'Middels', 'Høy'];

const allPriorities = [
  { user_class: 1, user_study: 1 },
  { user_class: 1, user_study: 2 },
  { user_class: 1, user_study: 3 },
  { user_class: 1, user_study: 5 },
  { user_class: 2, user_study: 1 },
  { user_class: 2, user_study: 2 },
  { user_class: 2, user_study: 3 },
  { user_class: 2, user_study: 5 },
  { user_class: 3, user_study: 1 },
  { user_class: 3, user_study: 2 },
  { user_class: 3, user_study: 3 },
  { user_class: 3, user_study: 5 },
  { user_class: 4, user_study: 4 },
  { user_class: 5, user_study: 4 },
];

const EventEditor = ({ eventId, goToEvent }: EventEditorProps) => {
  const classes = useStyles();
  const { data, isLoading, isError } = useEventById(eventId || -1);
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent(eventId || -1);
  const deleteEvent = useDeleteEvent(eventId || -1);
  const showSnackbar = useSnackbar();
  const [closeEventDialogOpen, setCloseEventDialogOpen] = useState(false);
  const [deleteEventDialogOpen, setDeleteEventDialogOpen] = useState(false);
  const [regPriorities, setRegPriorities] = useState<Array<RegistrationPriority>>([]);
  const { handleSubmit, register, watch, control, errors, getValues, reset, setValue } = useForm<FormValues>();
  const watchSignUp = watch('sign_up');
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    !isError || goToEvent(null);
  }, [isError]);

  const setValues = useCallback(
    (newValues: Event | null) => {
      setRegPriorities(newValues?.registration_priorities || allPriorities);
      reset({
        category: newValues?.category || 1,
        description: newValues?.description || '',
        end_date: newValues?.end_date ? parseISO(newValues.end_date) : new Date(),
        end_registration_at: newValues?.end_registration_at ? parseISO(newValues.end_registration_at) : new Date(),
        evaluate_link: newValues?.evaluate_link || '',
        image: newValues?.image || '',
        image_alt: newValues?.image_alt || '',
        limit: newValues?.limit || 0,
        location: newValues?.location || '',
        priority: newValues?.priority || 2,
        sign_off_deadline: newValues?.sign_off_deadline ? parseISO(newValues.sign_off_deadline) : new Date(),
        sign_up: newValues?.sign_up || false,
        start_date: newValues?.start_date ? parseISO(newValues.start_date) : new Date(),
        start_registration_at: newValues?.start_registration_at ? parseISO(newValues.start_registration_at) : new Date(),
        title: newValues?.title || '',
      });
      if (!newValues) {
        setTimeout(() => updateDates(new Date()), 100);
      }
    },
    [reset],
  );

  useEffect(() => {
    if (data) {
      setValues(data);
    } else {
      setValues(null);
    }
  }, [data, setValues]);

  const getEventPreview = () => {
    const values = getValues();
    return {
      ...values,
      list_count: 0,
      registration_priorities: regPriorities,
      waiting_list_count: 0,
      end_date: values.end_date.toJSON(),
      end_registration_at: values.end_registration_at.toJSON(),
      sign_off_deadline: values.sign_off_deadline.toJSON(),
      start_date: values.start_date.toJSON(),
      start_registration_at: values.start_registration_at.toJSON(),
    } as Event;
  };

  const remove = async () => {
    deleteEvent.mutate(null, {
      onSuccess: (data) => {
        showSnackbar(data.detail, 'success');
        setDeleteEventDialogOpen(false);
        goToEvent(null);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const closeEvent = async () => {
    await updateEvent.mutate({ ...data, closed: true } as Event, {
      onSuccess: () => {
        showSnackbar('Arrangementet ble stengt', 'success');
        setCloseEventDialogOpen(false);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  const submit: SubmitHandler<FormValues> = async (data) => {
    const event = {
      ...data,
      registration_priorities: regPriorities,
      end_date: data.end_date.toJSON(),
      end_registration_at: data.end_registration_at.toJSON(),
      sign_off_deadline: data.sign_off_deadline.toJSON(),
      start_date: data.start_date.toJSON(),
      start_registration_at: data.start_registration_at.toJSON(),
    } as Event;
    if (eventId) {
      await updateEvent.mutate(event, {
        onSuccess: () => {
          showSnackbar('Arrangementet ble oppdatert', 'success');
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    } else {
      await createEvent.mutate(event, {
        onSuccess: (newEvent) => {
          showSnackbar('Arrangementet ble opprettet', 'success');
          goToEvent(newEvent.id);
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      });
    }
  };

  const updateDates = (start?: Date) => {
    if (start && start instanceof Date && !isNaN(start.valueOf())) {
      const getDate = (daysBefore: number, hour: number) =>
        startOfHour(setHours(subDays(start, daysBefore), daysBefore === 0 ? Math.min(hour, start.getHours()) : hour));
      setValue('start_registration_at', getDate(7, 12));
      setValue('end_registration_at', getDate(0, 12));
      setValue('sign_off_deadline', getDate(1, 12));
      setValue('end_date', addHours(start, 2));
    }
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Grid container direction='column' wrap='nowrap'>
          <div className={classes.grid}>
            <TextField errors={errors} label='Tittel' name='title' register={register} required rules={{ required: 'Gi arrangementet en tittel' }} />
            <TextField errors={errors} label='Sted' name='location' register={register} required rules={{ required: 'Oppgi et sted for arrangementet' }} />
          </div>
          <div className={classes.grid}>
            <DatePicker
              control={control}
              errors={errors}
              label='Start'
              name='start_date'
              onDateChange={updateDates}
              required
              rules={{ required: 'Feltet er påkrevd' }}
              type='date-time'
            />
            <DatePicker
              control={control}
              errors={errors}
              label='Slutt'
              name='end_date'
              required
              rules={{
                required: 'Feltet er påkrevd',
                validate: {
                  afterStartDate: (value) => value > getValues().start_date || 'Slutt på arrangement må være etter start på arrangement',
                },
              }}
              type='date-time'
            />
          </div>
          <Bool control={control} errors={errors} label='Åpen for påmelding' name='sign_up' type='switch' />
          <Collapse in={watchSignUp}>
            <div className={classes.grid}>
              <DatePicker
                control={control}
                errors={errors}
                label='Start påmelding'
                name='start_registration_at'
                required={watchSignUp}
                rules={{ required: watchSignUp ? 'Feltet er påkrevd' : undefined }}
                type='date-time'
              />
              <DatePicker
                control={control}
                errors={errors}
                label='Slutt påmelding'
                name='end_registration_at'
                required={watchSignUp}
                rules={{
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                  validate: {
                    beforeStartDate: (value) => value < getValues().start_date || !watchSignUp || 'Påmeldingsslutt må være før start på arrangement',
                    afterRegistrationStart: (value) =>
                      value > getValues().start_registration_at || !watchSignUp || 'Påmeldingsslutt må være etter påmeldingsstart',
                  },
                }}
                type='date-time'
              />
            </div>
            <div className={classes.grid}>
              <DatePicker
                control={control}
                errors={errors}
                label='Avmeldingsfrist'
                name='sign_off_deadline'
                required={watchSignUp}
                rules={{
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                  validate: {
                    beforeStartDate: (value) => value < getValues().start_date || !watchSignUp || 'Avmeldingsfrist må være før start på arrangement',
                    afterRegistrationStart: (value) =>
                      value > getValues().start_registration_at || !watchSignUp || 'Avmeldingsfrist må være etter påmeldingsstart',
                  },
                }}
                type='date-time'
              />
              <TextField
                errors={errors}
                InputLabelProps={{ shrink: true }}
                inputProps={{ inputMode: 'numeric' }}
                label='Antall plasser'
                name='limit'
                register={register}
                required={watchSignUp}
                rules={{
                  pattern: { value: RegExp(/^[0-9]*$/), message: 'Skriv inn et heltall som 0 eller høyere' },
                  valueAsNumber: true,
                  min: { value: 0, message: 'Antall plasser må være 0 eller høyere' },
                  required: watchSignUp ? 'Feltet er påkrevd' : undefined,
                }}
              />
            </div>
            <TextField errors={errors} label='Evalueringsskjema (url)' name='evaluate_link' register={register} />
            <div className={classes.margin}>
              <Accordion className={classes.expansionPanel}>
                <AccordionSummary aria-controls='priorities' expandIcon={<ExpandMoreIcon />} id='priorities-header'>
                  <Typography>Prioriterte</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <EventRegistrationPriorities priorities={regPriorities} setPriorities={setRegPriorities} />
                </AccordionDetails>
              </Accordion>
            </div>
            {location.hostname !== 'tihlde.org' && (
              <div className={classes.margin}>
                <Accordion className={classes.expansionPanel}>
                  <AccordionSummary aria-controls='priorities' expandIcon={<ExpandMoreIcon />} id='survey-header'>
                    <Typography>Spørsmål ved påmelding</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {eventId && data ? (
                      <EventFormEditor eventId={eventId} formId={data.survey} />
                    ) : (
                      <Typography variant='subtitle2'>Du må opprette arrangementet før du kan legge til spørsmål</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            )}
          </Collapse>
          <MarkdownEditor
            error={Boolean(errors.description)}
            helperText={Boolean(errors.description) && 'Gi arrangementet en beskrivelse'}
            inputRef={register({ required: true })}
            name='description'
            required
          />
          <ImageUpload errors={errors} label='Velg bilde' name='image' ratio={21 / 9} register={register} setValue={setValue} watch={watch} />
          <TextField errors={errors} label='Bildetekst' name='image_alt' register={register} />
          <div className={classes.grid}>
            <Select control={control} errors={errors} label='Prioritering' name='priority'>
              {priorities.map((value, index) => (
                <MenuItem key={index} value={index}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {Boolean(categories.length) && (
              <Select control={control} errors={errors} label='Kategori' name='category'>
                {categories.map((value, index) => (
                  <MenuItem key={index} value={value.id}>
                    {value.text}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
          <RendererPreview className={classes.margin} getContent={getEventPreview} renderer={EventRenderer} />
          <SubmitButton className={classes.margin} disabled={isLoading} errors={errors}>
            {eventId ? 'Oppdater arrangement' : 'Opprett arrangement'}
          </SubmitButton>
          {eventId !== null && (
            <div className={classes.grid}>
              <Button className={classes.margin} color='error' disabled={isLoading} onClick={() => setCloseEventDialogOpen(true)} variant='outlined'>
                Steng
              </Button>
              <Button className={classes.margin} color='error' disabled={isLoading} onClick={() => setDeleteEventDialogOpen(true)} variant='outlined'>
                Slett
              </Button>
            </div>
          )}
        </Grid>
      </form>
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Å stenge et arrangement kan ikke reverseres. Eventuell på- og avmelding vil bli stoppet.'
        onClose={() => setCloseEventDialogOpen(false)}
        onConfirm={closeEvent}
        open={closeEventDialogOpen}
        titleText='Er du sikker?'
      />
      <Dialog
        confirmText='Ja, jeg er sikker'
        contentText='Sletting av arrangementer kan ikke reverseres.'
        onClose={() => setDeleteEventDialogOpen(false)}
        onConfirm={remove}
        open={deleteEventDialogOpen}
        titleText='Er du sikker?'
      />
    </>
  );
};

export default EventEditor;
