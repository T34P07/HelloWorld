import CharacterService from "./services/CharacterService";
import InputService from "./services/InputService";
import AnimationService from "./services/AnimationService";
import CameraService from "./services/CameraService";
import ControlService from "./services/ControlService";

CharacterService.PreStart();
InputService.Start();
CharacterService.Start();
AnimationService.Start();
CameraService.Start();
ControlService.Start();

import { Melee } from "shared/classes/Melee";

const tool = new Instance("Tool");
const katana = new Melee(tool, 20);
katana.attack();
