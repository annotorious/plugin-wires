import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { WiresPluginInstance, WiresPluginOpts, mountPlugin as _mountPlugin } from '@annotorious/plugin-wires';
import { WiresPluginProvider } from './WiresPluginProvider';

interface WiresPluginProps extends WiresPluginOpts {

  children?: ReactNode;

  enabled?: boolean;

}

export const WiresPlugin = (props: WiresPluginProps) => {

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => {
    const { children: _, enabled: __, ...opts } = props;
    _mountPlugin(anno, opts);
  }, []);

  useEffect(() => {
    if (instance)
      instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  useEffect(() => {
    if (instance)
      instance.setVisibility(props.showWires);
  }, [instance, props.showWires]);

  return (
    <WiresPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as WiresPluginInstance)} />

      {props.children}
    </WiresPluginProvider>
  )

}