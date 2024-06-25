import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import { Ability } from "./Ability";
import Events from "client/modules/Events";
import { Workspace } from "@rbxts/services";
import DashConfig from "shared/config/ability/DashConfig";

const camera = Workspace.CurrentCamera!;

export class Dash extends Ability {
    private linearVelocity: LinearVelocity;
    private characterService: CharacterServiceType;

    constructor(characterService: CharacterServiceType) {
        super();

        this.characterService = characterService;

        this.linearVelocity = new Instance("LinearVelocity");
        this.linearVelocity.Enabled = false;
        this.linearVelocity.MaxForce = 1e5;
        this.linearVelocity.Attachment0 = characterService.rootAttach;
        this.linearVelocity.Parent = characterService.hrp;
    }

    public Start()
    {
        if (!super.Start()) return false;

        const camCF = camera.CFrame;
        this.linearVelocity.VectorVelocity = camCF.LookVector.mul(150);
        this.linearVelocity.Enabled = true;
        Events.Character.Ability.Dash.SendToServer();

        task.delay(DashConfig.Duration, () => {
            this.linearVelocity.Enabled = false;
        })
        return true;
    }

}
