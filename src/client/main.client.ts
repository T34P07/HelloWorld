import AnimationManager from "./AnimationManager";
import CharacterManager from "./CharacterManager";
import CameraManager from "./CameraManager";

print("Pre starting modules!");

CharacterManager.PreStart();
CharacterManager.Start();
AnimationManager.Start();
CameraManager.Start();

print("Modules started!");
