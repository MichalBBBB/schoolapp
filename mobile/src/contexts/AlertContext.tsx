import React, {useEffect} from 'react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import {v4 as uuidv4} from 'uuid';
import {Alert} from '../components/modals/alert';

interface AlertObjectConstructorProps {
  text: string;
  subtext?: string;
  submitText?: string;
  cancelText?: string;
  submitDangerous?: boolean;
}

export class AlertObject {
  private onSubmitFunc: (() => void) | null = null;
  private onCloseFunc: (() => void) | null = null;
  public id: string;
  public text: string;
  public subtext?: string;
  public submitText: string;
  public cancelText: string;
  public submitDangerous: boolean;

  constructor({
    text,
    subtext,
    submitText = 'Ok',
    cancelText = 'Cancel',
    submitDangerous = false,
  }: AlertObjectConstructorProps) {
    this.id = uuidv4();
    this.text = text;
    this.subtext = subtext;
    this.submitText = submitText;
    this.cancelText = cancelText;
    this.submitDangerous = submitDangerous;
  }

  public onSubmit(func: () => void) {
    this.onSubmitFunc = func;
    return this;
  }

  public onClose(func: () => void) {
    this.onCloseFunc = func;
    return this;
  }

  public submit() {
    this.onSubmitFunc?.();
  }

  public close() {
    this.onCloseFunc?.();
  }
}

const AlertContext = createContext<(alert: AlertObject) => void>(() => {});

export const useAlert = () => {
  const value = useContext(AlertContext);
  return value;
};

export const AlertProvider: React.FC<{}> = ({children}) => {
  const [alerts, setAlerts] = useState<AlertObject[]>([]);
  const showAlert = (alert: AlertObject) => {
    setAlerts([...alerts, alert]);
  };
  return (
    <AlertContext.Provider value={showAlert}>
      <>
        {alerts.map((item, index) => (
          <Alert
            key={index}
            isVisible
            onClose={() => {
              setAlerts(alerts.filter(alert => alert.id !== item.id));
              item.close();
            }}
            onSubmit={() => {
              setAlerts(alerts.filter(alert => alert.id !== item.id));
              item.submit();
            }}
            text={item.text}
            subtext={item.subtext}
            submitDangerous={item.submitDangerous}
            submitText={item.submitText}
            cancelText={item.cancelText}
          />
        ))}
        {children}
      </>
    </AlertContext.Provider>
  );
};
