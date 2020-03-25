import Constants from "expo-constants"
import * as Permissions from 'expo-permissions'

class UserPermissions {
  async getPhotoPermission() {
    const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Habilite as permissões para fotos');
    }
  }
}

export default new UserPermissions();
