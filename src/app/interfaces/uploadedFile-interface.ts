export enum UploadType {Gallery = 'Gallery', Document = 'Document'}
export interface UploadedFileInterface {
  id: Number;
  name: string;
  path: string;
  uploadType: UploadType;
}
