import { RegisterOptions, UseFormMethods } from 'react-hook-form';

// Material UI Components
import MuiTextField, { TextFieldProps } from '@material-ui/core/TextField';

export type IProps = TextFieldProps &
  Pick<UseFormMethods, 'register' | 'errors'> & {
    rules?: RegisterOptions;
    name: string;
  };

const TextField = ({ register, name, errors = {}, rules = {}, ...props }: IProps) => {
  return (
    <MuiTextField
      error={Boolean(errors[name])}
      fullWidth
      helperText={errors[name]?.message}
      InputLabelProps={{ shrink: true }}
      inputRef={register && register(rules)}
      margin='normal'
      name={name}
      placeholder={props.placeholder || 'Skriv her'}
      required={Boolean(rules.required)}
      variant='outlined'
      {...props}
    />
  );
};

export default TextField;
