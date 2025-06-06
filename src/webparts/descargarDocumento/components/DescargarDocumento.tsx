import * as React from 'react';
import styles from './DescargarDocumento.module.scss';
import type { IDescargarDocumentoProps } from './IDescargarDocumentoProps';
import { IconButton } from '@fluentui/react';
import { getSP } from '../pnpjsConfig';

export default function DescargarDocumento(props: IDescargarDocumentoProps): JSX.Element {
  const { documentName, downloadLink, DirName } = props;

  const [latestFileUrl, setLatestFileUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLatestFile = async () => {
      if (!downloadLink) {
        console.warn('⚠️ No se proporcionó una ruta de carpeta (downloadLink).');
        return;
      }

      try {
        console.log("📁 Ruta recibida:", downloadLink);

        const sp = getSP();
        const items = await sp.web.lists
          .getByTitle(DirName)
          .items
          .select('File/Name', 'File/ServerRelativeUrl', 'File/TimeLastModified', 'FileDirRef')
          .expand('File')
          .filter(`startswith(FileDirRef, '${downloadLink}')`)
          .top(4999)();

        console.log("📦 Archivos devueltos:", items);

        const sorted = items
          .filter(i => i.File)
          .sort((a, b) =>
            new Date(b.File.TimeLastModified).getTime() - new Date(a.File.TimeLastModified).getTime()
          );

        if (sorted.length > 0) {
          const fullUrl = window.location.origin + sorted[0].File.ServerRelativeUrl;
          console.log("✅ Archivo encontrado:", fullUrl);
          setLatestFileUrl(fullUrl);
        } else {
          console.warn('⚠️ No se encontraron archivos en la carpeta.');
          setLatestFileUrl(null);
        }
      } catch (error) {
        console.error('❌ Error al obtener el archivo:', error);
        setLatestFileUrl(null);
      }
    };

    void fetchLatestFile();
  }, [downloadLink]);

  const handleDownloadClick = () => {
    if (latestFileUrl) {
      window.open(latestFileUrl, '_blank');
    } else {
      alert('No se ha encontrado un archivo para descargar.');
    }
  };

  return (
    <div id="documentdownWrapper-webpart" className={styles.documentdownWrapper}>
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
    </div>
  );
}
