import AnimationService from "./AnimationService";
import CharacterService from "./CharacterService";
import CameraService from "./CameraService";

print("Pre starting modules!");

CharacterService.PreStart();

print("Start CharacterService", CharacterService);
CharacterService.Start();
print("Start AnimationService", AnimationService);
AnimationService.Start();
print("Start CameraService", CameraService);
CameraService.Start();

print("Modules started!");
