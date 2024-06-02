import CharacterService from "./services/CharacterService";
import InputService from "./InputService";
import AnimationService from "./services/AnimationService";
import CameraService from "./services/CameraService";

CharacterService.PreStart();
InputService.Start();
CharacterService.Start();
AnimationService.Start();
CameraService.Start();
