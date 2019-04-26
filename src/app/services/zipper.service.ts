import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import JSZip from 'jszip';
import saveAs from 'jszip/vendor/FileSaver';

export interface RemoteFile {
  filename: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ZipperService {
  constructor(private httpClient: HttpClient) {}

  private downloadFile(url: string): Promise<Blob> {
    return this.httpClient
      .get(url, {
        responseType: 'blob'
      })
      .toPromise();
  }

  async zipFilesFromUrls(files: RemoteFile[], zipName: string): Promise<void> {
    const zip = new JSZip();

    const folder = zip.folder(zipName);

    await Promise.all(
      files.map(async ({ filename, url }) => {
        const blob = await this.downloadFile(url);
        folder.file(filename, blob);
      })
    );

    const zipContent = await zip.generateAsync({ type: 'blob' });
    saveAs(zipContent, `${zipName}.zip`);
  }
}
