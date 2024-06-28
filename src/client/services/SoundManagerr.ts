import { SoundService } from "@rbxts/services";

const SoundManager = {
    PlaySound: (name: string, parent?: Instance) => {
        let sound = SoundService.FindFirstChild(name, true) as Sound;
        if (!sound) return;

        if (parent)
        {
            sound = sound.Clone();
            sound.Parent = parent;
        }

        sound.Play();
    }
}

export default SoundManager;
