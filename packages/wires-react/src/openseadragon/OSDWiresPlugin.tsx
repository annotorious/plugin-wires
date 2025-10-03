import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AnnotoriousPlugin, useViewer } from '@annotorious/react';
import { mountOSDPlugin, WiresPluginOpts } from '@annotorious/plugin-wires';
import { ImageAnnotator } from '@annotorious/annotorious';
import { WiresPluginProvider } from 'src/WiresPluginProvider';

type WiresPluginInstance = ReturnType<typeof mountOSDPlugin>;

interface OSDWiresPluginProps extends WiresPluginOpts {

  children?: ReactNode;

  enabled?: boolean;

}

export const OSDWiresPlugin = (props: OSDWiresPluginProps) => {

  const viewer = useViewer();

  const [instance, setInstance] = useState<WiresPluginInstance>();

  const mountPlugin = useCallback((anno: ImageAnnotator) => {
    if (!viewer) return;
    const { children: _, enabled: __, ...opts } = props;
    return mountOSDPlugin(anno, viewer, opts);
  }, [viewer]);

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