import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousImageAnnotator, AnnotoriousPlugin } from '@annotorious/react';
import { WiresPluginInstance, WiresVisibility, mountPlugin as _mountPlugin } from '@annotorious/plugin-wires';
import { WiresPluginProvider } from './WiresPluginProvider';

interface WiresPluginProps {

  children?: ReactNode;

  enabled?: boolean;

  visibility?: WiresVisibility;

}

export const WiresPlugin = (props: WiresPluginProps) => {

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: AnnotoriousImageAnnotator) => _mountPlugin(anno, {
    showWires: props.visibility
  }), []);

  useEffect(() => {
    if (instance)
      instance.setEnabled(props.enabled);
  }, [instance, props.enabled]);

  useEffect(() => {
    if (instance)
      instance.setVisibility(props.visibility);
  }, [instance, props.visibility]);

  return (
    <WiresPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as WiresPluginInstance)} />

      {props.children}
    </WiresPluginProvider>
  )

}