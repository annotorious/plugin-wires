import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { WiresPluginInstance, mountPlugin as _mountPlugin } from '@annotorious/plugin-wires';
import { WiresPluginProvider } from './WiresPluginProvider';

interface WiresPluginProps {

  children?: ReactNode;

  enabled?: boolean;

}

export const WiresPlugin = (props: WiresPluginProps) => {

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => _mountPlugin(anno), []);

  useEffect(() => {
    if (instance)
      instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  return (
    <WiresPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as WiresPluginInstance)} />

      {props.children}
    </WiresPluginProvider>
  )

}