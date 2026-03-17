import { saveMedia } from '../media'

export function saveImageToPhotosAlbum(opts: saveImageToPhotosAlbum.Option): Promise<CallbackResult> {
  return saveMedia(opts, 'photo', 'saveImageToPhotosAlbum')
}
