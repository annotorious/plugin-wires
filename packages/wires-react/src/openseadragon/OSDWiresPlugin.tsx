import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { mountOSDPlugin } from '@annotorious/plugin-wires';
import { ImageAnnotator } from '@annotorious/annotorious';
import { WiresPluginProvider } from 'src/WiresPluginProvider';

type WiresPluginInstance = ReturnType<typeof mountOSDPlugin>;

interface OSDWiresPluginProps {

  children?: ReactNode;

  enabled?: boolean;

}

export const OSDWiresPlugin = (props: OSDWiresPluginProps) => {

  const viewer = useViewer();

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer), [viewer]);

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