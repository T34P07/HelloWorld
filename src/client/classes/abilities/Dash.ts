import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import { Ability } from "./Ability";
import Events from "client/modules/Events";
import { Workspace } from "@rbxts/services";
import DashConfig from "shared/config/ability/DashConfig";

const camera = Workspace.CurrentCamera!;

export class Dash extends Ability {
    private linearVelocity: LinearVelocity;

    constructor(characterService: CharacterServiceType) {
        super(characterService);

        this.linearVelocity = new Instance("LinearVelocity");
        this.linearVelocity.Enabled = false;
        this.linearVelocity.ForceLimitMode = Enum.ForceLimitMode.PerAxis;
        this.linearVelocity.MaxAxesForce = new Vector3(1e8, 5e3, 1e8);
        this.linearVelocity.Attachment0 = characterService.rootAttach;
        this.linearVelocity.Parent = characterService.hrp;
    }

    public Start()
    {
        if (!super.Start()) return false;
        this.SetCooldown(DashConfig.Cooldown);

        const camCF = camera.CFrame;
        this.linearVelocity.VectorVelocity = camCF.LookVector.mul(DashConfig.VelocityFactor);
        this.linearVelocity.Enabled = true;
        this.actionAnimator.PlayAnimation("Dash", .1);
        Events.Character.Ability.Dash.SendToServer();

        task.delay(DashConfig.Duration, () => {
            this.linearVelocity.Enabled = false;
        })
        return true;
    }

}
