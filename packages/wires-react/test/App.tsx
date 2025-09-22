import { useEffect, useState } from 'react';
import { Annotation, Annotator, ImageAnnotator, useAnnotator } from '@annotorious/react';
import { W3CImageRelationFormat } from '@annotorious/plugin-wires'; 
import { WirePopup, WiresPlugin } from '../src';

export const App = () => {

  const [mode, setMode] = useState<'ANNOTATE' | 'RELATIONS'>('ANNOTATE');

  const [enabled, setEnabled] = useState(false);

  const anno = useAnnotator<Annotator<Annotation, Annotation>>();

  useEffect(() => {
    if (mode === 'RELATIONS')
      setEnabled(true);
  }, [mode]);

  useEffect(() => {
    if (!anno) return;

    const onUpdate = (a: Annotation, _: Annotation) => console.log('updated', a);
    anno.on('updateAnnotation', onUpdate);

    anno.loadAnnotations('annotations.json');

    const onCreate = () => setEnabled(false);
    anno.on('createAnnotation', onCreate);

    return () => {
      anno.off('updateAnnotation', onUpdate);
      anno.off('createAnnotation', onCreate);
    }
  }, [anno]);

  return (
    <div id="content">
      <div>
        <button onClick={() => setMode(mode => mode === 'ANNOTATE' ? 'RELATIONS' : 'ANNOTATE')}>
          {mode === 'ANNOTATE' ? 'Annotate' : 'Relations'}
        </button>
      </div>

      <ImageAnnotator
        // @ts-ignore
        adapter={W3CImageRelationFormat('640px-Hallstatt.jpg')}>
        <img src="640px-Hallstatt.jpg" />
      </ImageAnnotator>

      <WiresPlugin 
        enabled={enabled}>
        <WirePopup 
          popup={props => (
            <div>
              <button onClick={() => props.onCreateBody({ purpose: 'testing', value: 'test'})}>Add Tag</button>
            </div>
          )} />
      </WiresPlugin>
    </div>
  )

}