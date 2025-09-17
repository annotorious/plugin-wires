import { useContext } from 'react';
import { ConnectorPluginInstance } from '@annotorious/plugin-wires';
import { ConnectorPluginContext } from '../WiresPluginProvider';

export const useConnectorPlugin = () => {
  const { instance } = useContext(ConnectorPluginContext);
  return instance as ConnectorPluginInstance;
}
