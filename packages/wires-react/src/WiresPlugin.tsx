import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { ConnectorPluginInstance, mountPlugin as _mountPlugin } from '@annotorious/plugin-wires';
import { ConnectorPluginProvider } from './WiresPluginProvider';

interface WiresPluginProps {

  children?: ReactNode;

  enabled?: boolean;

}

export const WiresPlugin = (props: WiresPluginProps) => {

  const [instance, setInstance] = useState<ConnectorPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => _mountPlugin(anno), []);

  useEffect(() => {
    if (instance)
      instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  return (
    <ConnectorPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as ConnectorPluginInstance)} />

      {props.children}
    </ConnectorPluginProvider>
  )

}