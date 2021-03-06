import { ReactNode } from 'react';

// Material UI Components
import { Button, Dialog as MuiDialog, DialogProps as MuiDialogProps, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';

export type DialogProps = MuiDialogProps & {
  onClose: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  titleText?: string;
  children?: ReactNode;
  contentText?: string;
  closeText?: string;
  confirmText?: string;
  disabled?: boolean;
};

const Dialog = ({
  open,
  onClose,
  onCancel,
  onConfirm,
  titleText,
  children,
  contentText,
  closeText,
  confirmText,
  disabled = false,
  maxWidth = 'md',
  fullWidth = true,
  ...props
}: DialogProps) => {
  return (
    <MuiDialog aria-labelledby='dialog-title' fullWidth={fullWidth} maxWidth={maxWidth} onClose={onClose} open={open} {...props}>
      {titleText && <DialogTitle id='dialog-title'>{titleText}</DialogTitle>}
      {(contentText || children) && (
        <DialogContent>
          {contentText && <DialogContentText>{contentText}</DialogContentText>}
          {children}
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onCancel || onClose}>{closeText || 'Lukk'}</Button>
        {onConfirm && (
          <Button disabled={disabled} onClick={onConfirm || onCancel} variant='contained'>
            {confirmText || 'OK'}
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
