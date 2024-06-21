import { Players } from "@rbxts/services";
import TestStory from "./TestStory.story";

const localPlayer = Players.LocalPlayer;
const PlayerGui = localPlayer.WaitForChild("PlayerGui");

const GameRouter = {
    Start: () => {
        const handle = new Instance("ScreenGui", PlayerGui);
      //  const root = ReactRoblox.createRoot(handle);

      TestStory(handle);
    }

};


export default GameRouter;