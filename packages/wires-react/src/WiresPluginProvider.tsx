import { ReactNode, createContext } from 'react';
import { WiresPluginInstance } from '@annotorious/plugin-wires';

interface WiresPluginProviderProps {

  children: ReactNode;

  instance?: WiresPluginInstance;

}

export const WiresPluginContext = createContext({

  instance: undefined,

});

export const WiresPluginProvider = (props: WiresPluginProviderProps) => {

  return (
    <WiresPluginContext.Provider value={{ instance: props.instance }}>
      {props.children}
    </WiresPluginContext.Provider>
  )

}