import * as React from 'react';
import styles from './DescargarDocumento.module.scss';
import type { IDescargarDocumentoProps } from './IDescargarDocumentoProps';
import { IconButton } from '@fluentui/react';

export default function DescargarDocumento(props: IDescargarDocumentoProps): JSX.Element {
  const { documentName, downloadLink } = props;

  const handleDownloadClick = () => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');

      alert('No se ha configurado un enlace de descarga.');
    }
  };

  return (
    <div className={styles.descargarContainer}>
      <div className={styles.inputRow}>
        <span className={styles.textInput}>{documentName}</span>
        <IconButton
          iconProps={{ iconName: 'Download' }}
          title="Descargar"
          ariaLabel="Descargar"
          onClick={handleDownloadClick}
          disabled={!downloadLink}
        />
      </div>
    </div>
  );
}
