import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";
import { Ability } from "./Ability";
import ControlService from "client/services/ControlService";
import Events from "client/modules/Events";

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
        const hrpCF = this.characterService.hrp!.CFrame;
        this.linearVelocity.VectorVelocity = hrpCF.LookVector.mul(150);
        this.linearVelocity.Enabled = true;
        Events.Character.Ability.Dash.SendToServer();

        task.delay(.1, () => {
            this.linearVelocity.Enabled = false;
        })
    }

}