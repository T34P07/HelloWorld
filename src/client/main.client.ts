import CharacterService from "./services/CharacterService";
import InputService from "./services/InputService";
import CameraService from "./services/CameraService";
import TagService from "./services/TagService";
import PlayerGuiService from "./services/PlayerGuiService";
import ToastStory from "./ui/stories/TestStory.story";
import GameRouter from "./ui/stories/GameRouter";

CameraService.Start();
CharacterService.PreStart();
InputService.Start();
CharacterService.Start();
TagService.Start();
PlayerGuiService.Start();
//GameRouter.Start();