import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
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

  const ref = useRef<WiresPluginInstance>(null);

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: ImageAnnotator) => mountOSDPlugin(anno, viewer), [viewer]);

  useEffect(() => {
    ref.current?.setEnabled(props.enabled);
  }, [props.enabled]);

  return (
    <WiresPluginProvider instance={instance}>
      <AnnotoriousPlugin 
        pluginRef={ref}
        plugin={mountPlugin} 
        onLoad={instance => setInstance(instance as WiresPluginInstance)} />

      {props.children}
    </WiresPluginProvider>
  )

}