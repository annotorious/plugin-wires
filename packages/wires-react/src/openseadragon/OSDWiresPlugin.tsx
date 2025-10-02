import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { mountOSDPlugin, WiresVisibility } from '@annotorious/plugin-wires';
import { ImageAnnotator } from '@annotorious/annotorious';
import { WiresPluginProvider } from 'src/WiresPluginProvider';

type WiresPluginInstance = ReturnType<typeof mountOSDPlugin>;

interface OSDWiresPluginProps {

  children?: ReactNode;

  enabled?: boolean;

  visibility?: WiresVisibility;

}

export const OSDWiresPlugin = (props: OSDWiresPluginProps) => {

  const viewer = useViewer();

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer, {
    showWires: props.visibility
  }), [viewer]);

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