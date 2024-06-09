import CharacterService from "./services/CharacterService";
import InputService from "./services/InputService";
import CameraService from "./services/CameraService";
import ControlService from "./services/ControlService";
import TagService from "./services/TagService";

CharacterService.PreStart();
InputService.Start();
CharacterService.Start();
CameraService.Start();
ControlService.Start();
TagService.Start();
