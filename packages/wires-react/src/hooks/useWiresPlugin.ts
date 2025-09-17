import { useContext } from 'react';
import { WiresPluginInstance } from '@annotorious/plugin-wires';
import { WiresPluginContext } from '../WiresPluginProvider';

export const useWiresPlugin = () => {
  const { instance } = useContext(WiresPluginContext);
  return instance as WiresPluginInstance;
}
