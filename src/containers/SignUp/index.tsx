import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import URLS from 'URLS';
import { EMAIL_REGEX } from 'constant';
import { getUserStudyLong, getUserClass } from 'utils';
import { UserCreate } from 'types/Types';
import { useCreateUser } from 'api/hooks/User';
import { useSetRedirectUrl, useRedirectUrl } from 'api/hooks/Misc';
import { useSnackbar } from 'api/hooks/Snackbar';

// Material UI Components
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessIcon from '@material-ui/icons/ExpandLessRounded';

// Project Components
import Page from 'components/navigation/Page';
import Paper from 'components/layout/Paper';
import Select from 'components/inputs/Select';
import SubmitButton from 'components/inputs/SubmitButton';
import TextField from 'components/inputs/TextField';
import TihldeLogo from 'components/miscellaneous/TihldeLogo';
import { SecondaryTopBox } from 'components/layout/TopBox';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: theme.breakpoints.values.md,
    margin: 'auto',
    position: 'relative',
    left: 0,
    right: 0,
    top: -60,
  },
  logo: {
    height: 30,
    width: 'auto',
    marginBottom: theme.spacing(1),
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  double: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
  },
}));

type SignUpData = UserCreate & {
  password_verify: string;
};

const SignUp = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const createUser = useCreateUser();
  const showSnackbar = useSnackbar();
  const { handleSubmit, errors, control, setError, register } = useForm<SignUpData>();
  const setLogInRedirectURL = useSetRedirectUrl();
  const redirectURL = useRedirectUrl();
  const [faqOpen, setFaqOpen] = useState(false);

  const onSignUp = async (data: SignUpData) => {
    if (getUserStudyLong(data.user_study) === 'Digital samhandling' && ![4, 5].includes(data.user_class)) {
      setError('user_class', { message: 'Digital samhandling har kun 4 og 5 klasse' });
      return;
    }
    if (!(getUserStudyLong(data.user_study) === 'Digital samhandling') && [4, 5].includes(data.user_class)) {
      setError('user_class', { message: `${getUserStudyLong(data.user_study)} har ikke 4 og 5 klasse` });
      return;
    }
    if (data.password !== data.password_verify) {
      setError('password', { message: 'Passordene må være like' });
      setError('password_verify', { message: 'Passordene må være like' });
      return;
    }

    const userData = {
      user_id: data.user_id.toLowerCase(),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      user_class: data.user_class,
      user_study: data.user_study,
      password: data.password,
    } as UserCreate;
    createUser.mutate(userData, {
      onSuccess: () => {
        window.gtag('event', 'signup', {
          event_category: 'auth',
          event_label: `Signed up`,
        });
        setLogInRedirectURL(null);
        navigate(redirectURL || URLS.login);
      },
      onError: (e) => {
        showSnackbar(e.detail, 'error');
      },
    });
  };

  return (
    <Page banner={<SecondaryTopBox />} options={{ title: 'Ny bruker' }}>
      <Paper className={classes.paper}>
        {createUser.isLoading && <LinearProgress className={classes.progress} />}
        <TihldeLogo className={classes.logo} darkColor='white' lightColor='blue' size='large' />
        <Typography variant='h3'>Opprett bruker</Typography>
        <form onSubmit={handleSubmit(onSignUp)}>
          <div className={classes.double}>
            <TextField
              disabled={createUser.isLoading}
              errors={errors}
              label='Fornavn'
              name='first_name'
              register={register}
              required
              rules={{ required: 'Feltet er påkrevd' }}
            />
            <TextField
              disabled={createUser.isLoading}
              errors={errors}
              label='Etternavn'
              name='last_name'
              register={register}
              required
              rules={{ required: 'Feltet er påkrevd' }}
            />
          </div>
          <TextField
            disabled={createUser.isLoading}
            errors={errors}
            label='Feide brukernavn'
            name='user_id'
            register={register}
            required
            rules={{ required: 'Feltet er påkrevd', validate: (value) => !value.includes('@') || 'Brukernavn må være uten @stud.ntnu.no' }}
          />
          <TextField
            disabled={createUser.isLoading}
            errors={errors}
            label='E-post'
            name='email'
            register={register}
            required
            rules={{
              required: 'Feltet er påkrevd',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Ugyldig e-post',
              },
            }}
            type='email'
          />
          <div className={classes.double}>
            <Select control={control} errors={errors} label='Studie' name='user_study' rules={{ required: 'Feltet er påkrevd' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MenuItem key={i} value={i}>
                  {getUserStudyLong(i)}
                </MenuItem>
              ))}
            </Select>
            <Select control={control} errors={errors} label='Klasse' name='user_class' rules={{ required: 'Feltet er påkrevd' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <MenuItem key={i} value={i}>
                  {getUserClass(i)}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className={classes.double}>
            <TextField
              disabled={createUser.isLoading}
              errors={errors}
              label='Passord'
              name='password'
              register={register}
              required
              rules={{
                required: 'Feltet er påkrevd',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 karakterer',
                },
              }}
              type='password'
            />
            <TextField
              disabled={createUser.isLoading}
              errors={errors}
              label='Gjenta passord'
              name='password_verify'
              register={register}
              required
              rules={{
                required: 'Feltet er påkrevd',
                minLength: {
                  value: 8,
                  message: 'Minimum 8 karakterer',
                },
              }}
              type='password'
            />
          </div>
          <Typography variant='body2'>
            OBS: Når du har klikket &quot;Opprett bruker&quot; må vi godkjenne deg før du får logge inn. Les mer om hvorfor lengre ned.
          </Typography>
          <SubmitButton className={classes.button} disabled={createUser.isLoading} errors={errors}>
            Opprett bruker
          </SubmitButton>
          <Button className={classes.button} component={Link} disabled={createUser.isLoading} fullWidth to={URLS.login}>
            Logg inn
          </Button>
          <Button
            className={classes.button}
            endIcon={faqOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            fullWidth
            onClick={() => setFaqOpen((oldState) => !oldState)}
            variant='outlined'>
            Hvorfor må vi godkjenne deg?
          </Button>
          <Collapse in={faqOpen}>
            <Typography className={classes.button} variant='body2'>
              {`For å unngå at vi får mange brukere som ikke er reelle TIHLDE-medlemmer, må vi aktivere nye brukere før de får logge inn. Det kan ta noen timer
              før noen av oss i Index eller HS får verifisert brukeren din. Hvis det haster eller tar mer enn 24 timer kan du sende en melding til TIHLDE på `}
              <a href='https://m.me/tihlde' rel='noopener noreferrer' target='_blank'>
                Messenger
              </a>
              .
            </Typography>
          </Collapse>
        </form>
      </Paper>
    </Page>
  );
};

export default SignUp;
