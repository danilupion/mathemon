import classNames from 'classnames';
import { PropsWithChildren } from 'react';

import styles from './index.module.scss';

export enum MessageType {
  Error = 'error',
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
}

type MessageProps = PropsWithChildren<{
  type: MessageType;
  className?: string;
}>;

const Message = ({ children, className, type }: MessageProps) => {
  return (
    <div
      className={classNames(styles.message, className, {
        [styles.success]: type === MessageType.Success,
        [styles.error]: type === MessageType.Error,
        [styles.info]: type === MessageType.Info,
        [styles.warning]: type === MessageType.Warning,
      })}
    >
      {children}
    </div>
  );
};

export default Message;

const messageFactory = (type: MessageType) =>
  function GeneratedMessage(props: Omit<MessageProps, 'type'>) {
    return <Message type={type} {...props} />;
  };

export const ErrorMessage = messageFactory(MessageType.Error);
export const InfoMessage = messageFactory(MessageType.Info);
export const SuccessMessage = messageFactory(MessageType.Success);
export const WarningMessage = messageFactory(MessageType.Warning);
