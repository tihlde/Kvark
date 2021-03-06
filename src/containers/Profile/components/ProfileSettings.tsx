import { useForm } from 'react-hook-form';
import { getUserStudyLong, getUserClass } from 'utils';
import { UserList } from 'types/Types';
import { useUpdateUser } from 'api/hooks/User';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material-UI
import { makeStyles } from '@material-ui/styles';
import { MenuItem, Typography } from '@material-ui/core';

// Project components
import TextField from 'components/inputs/TextField';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import { ImageUpload } from 'components/inputs/Upload';

const useStyles = makeStyles((theme) => ({
  selectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
  gutterTop: {
    marginTop: theme.spacing(2),
  },
}));

export type ProfileSettingsProps = {
  user: UserList;
  isAdmin?: boolean;
};

type FormData = Pick<UserList, 'first_name' | 'last_name' | 'email' | 'cell' | 'image' | 'gender' | 'allergy' | 'tool' | 'user_class' | 'user_study'>;

const ProfileSettings = ({ isAdmin, user }: ProfileSettingsProps) => {
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const updateUser = useUpdateUser();
  const { register, handleSubmit, errors, control, setValue, watch } = useForm<FormData>({ defaultValues: { ...user } });
  const updateData = (data: FormData) => {
    if (updateUser.isLoading) {
      return;
    }
    updateUser.mutate(
      { userId: user.user_id, user: { ...user, ...data } },
      {
        onSuccess: () => {
          showSnackbar('Bruker oppdatert', 'success');
          window.gtag('event', 'update-settings', {
            event_category: 'profile',
            event_label: `Update`,
          });
        },
        onError: (e) => {
          showSnackbar(e.detail, 'error');
        },
      },
    );
  };

  if (!user) {
    return null;
  } else {
    return (
      <form onSubmit={handleSubmit(updateData)}>
        {isAdmin && (
          <div className={classes.selectGrid}>
            <TextField disabled={updateUser.isLoading} errors={errors} label='Fornavn' name='first_name' register={register} />
            <TextField disabled={updateUser.isLoading} errors={errors} label='Etternavn' name='last_name' register={register} />
            <TextField disabled={updateUser.isLoading} errors={errors} label='Epost' name='email' register={register} />
          </div>
        )}
        <TextField disabled={updateUser.isLoading} errors={errors} InputProps={{ type: 'number' }} label='Telefon' name='cell' register={register} />
        <ImageUpload errors={errors} label='Velg profilbilde' name='image' ratio={1} register={register} setValue={setValue} watch={watch} />
        <div className={classes.selectGrid}>
          <Select control={control} disabled={!isAdmin} errors={errors} label='Studie' name='user_study'>
            {[1, 2, 3, 4, 5].map((i) => (
              <MenuItem key={i} value={i}>
                {getUserStudyLong(i)}
              </MenuItem>
            ))}
          </Select>
          <Select control={control} disabled={!isAdmin} errors={errors} label='Klasse' name='user_class'>
            {[1, 2, 3, 4, 5].map((i) => (
              <MenuItem key={i} value={i}>
                {getUserClass(i)}
              </MenuItem>
            ))}
          </Select>
          <Select control={control} disabled={updateUser.isLoading} errors={errors} label='Kjønn' name='gender'>
            <MenuItem value={1}>Mann</MenuItem>
            <MenuItem value={2}>Kvinne</MenuItem>
            <MenuItem value={3}>Annet</MenuItem>
          </Select>
        </div>
        <TextField disabled={updateUser.isLoading} errors={errors} label='Kjøkkenredskap' name='tool' register={register} />
        <TextField disabled={updateUser.isLoading} errors={errors} label='Evt allergier og annen info' multiline name='allergy' register={register} rows={3} />
        <SubmitButton disabled={updateUser.isLoading} errors={errors}>
          Oppdater
        </SubmitButton>
        {!isAdmin && (
          <Typography className={classes.gutterTop} variant='body2'>
            {`Er navn, epost, klasse eller studie er feil? Ta kontakt med oss på `}
            <a href='https://m.me/tihlde' rel='noopener noreferrer' target='_blank'>
              Messenger
            </a>
            {` eller Slack.`}
          </Typography>
        )}
      </form>
    );
  }
};

export default ProfileSettings;
