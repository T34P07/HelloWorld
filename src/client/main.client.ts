import CharacterService from "./services/CharacterService";
import InputService from "./services/InputService";
import CameraService from "./services/CameraService";
import ControlService from "./services/ControlService";
import TagService from "./services/TagService";
import PlayerGuiService from "./services/PlayerGuiService";
import ToastStory from "./ui/stories/TestStory.story";
import GameRouter from "./ui/stories/GameRouter";

CharacterService.PreStart();
InputService.Start();
CharacterService.Start();
CameraService.Start();
ControlService.Start();
TagService.Start();
PlayerGuiService.Start();
GameRouter.Start();