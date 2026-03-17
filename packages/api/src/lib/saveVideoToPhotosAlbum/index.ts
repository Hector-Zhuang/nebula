import { saveMedia } from '../media'

export function saveVideoToPhotosAlbum(opts: saveVideoToPhotosAlbum.Option): Promise<CallbackResult> {
  return saveMedia(opts, 'video', 'saveVideoToPhotosAlbum')
}
