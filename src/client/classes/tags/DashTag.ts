import { RunService, Workspace } from "@rbxts/services";
import { Tag } from "./Tag";
import { Trove } from "@rbxts/trove";
import RemoveAllTags from "shared/utilities/RemoveAllTags";
import { Timer } from "@rbxts/timer";

export class DashTag extends Tag
{
    private trove = new Trove();
    private timer: Timer;

	constructor(instance: Instance, tagClass: string) {
		super(instance, tagClass);
        this.instance.Archivable = true;

       // this.trove.add(RunService.PreRender.Connect(() => this.Update()));
        this.timer = new Timer(.01);
        this.trove.add(this.timer);
        this.timer.completed.Connect(() => this.Update());
        this.timer.start();
    }

    Update()
    {
        this.timer.start();


        
        const clone = this.instance.Clone();
        RemoveAllTags(clone);
        //this.trove.add(clone);
       
        clone.GetDescendants().forEach((instance: Instance) => {
            if (!instance.IsA("BasePart")) return;

            instance.CollisionGroup = "None";
            instance.Anchored = true;
        });

        clone.Parent = Workspace;
    }

    Destroy() {
        this.trove.clean();
    }
}