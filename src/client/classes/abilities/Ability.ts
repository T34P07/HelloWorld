import { ActionAnimator } from "client/services/ActionAnimator";
import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import Prefabs from "shared/libraries/Prefabs";

export class Ability
{
    private cooldown = { start: 0, duration: 0 };
    protected actionAnimator: ActionAnimator;
    protected characterService: CharacterServiceType;

    constructor(characterService: CharacterServiceType) {
        this.characterService = characterService;
        this.actionAnimator = new ActionAnimator(this.characterService.char!, this.characterService.viewmodel);
        this.actionAnimator.LoadAnimations(Prefabs.Animations.Movement.Action);
    }

    protected SetCooldown(duration: number)
    {
        this.cooldown = { start: os.clock(), duration: duration };
    }

    protected IsOnCooldown()
    {
        const now = os.clock();
        if (now - this.cooldown.start < this.cooldown.duration)
            return true;

        return false;
    }

    Start() {
        if (this.IsOnCooldown()) return false;

        return true;
    }

    Stop() {}
}
