import { useEffect, useState } from 'react';
import { APK_PATH } from '../site';
import { getDownload, type DownloadInfo } from '../download';
import { AndroidIcon } from './Icon';

export function DownloadButton({ label = 'Download for Android', onClick }: { label?: string; onClick?: () => void }) {
  const [info, setInfo] = useState<DownloadInfo | null>(null);
  useEffect(() => {
    getDownload().then(setInfo);
  }, []);
  const meta = [info?.version && `Version ${info.version}`, info?.sizeMb && `${info.sizeMb} MB`, 'Android 8 or newer', 'free'].filter(Boolean).join(' · ');
  return (
    <>
      <a className="btn dark" href={info?.url ?? APK_PATH} onClick={onClick} rel="noopener">
        <AndroidIcon />
        {label}
      </a>
      <p className="btn-note">{meta}</p>
    </>
  );
}
