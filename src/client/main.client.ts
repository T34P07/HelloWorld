import AnimationService from "./AnimationService";
import CharacterService from "./CharacterService";
import CameraService from "./CameraService";
import InputService from "./InputService";

CharacterService.PreStart();
print("GIGA NIGER");
InputService.Start();
CharacterService.Start();
AnimationService.Start();
CameraService.Start();
