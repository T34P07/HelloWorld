import { Debris, TweenService, Workspace } from "@rbxts/services";
import { Tag } from "./Tag";
import { Trove } from "@rbxts/trove";
import RemoveAllTags from "shared/utilities/RemoveAllTags";
import { Timer } from "@rbxts/timer";

const tweenInfo = new TweenInfo(.15);

export class DashTag extends Tag {
    private trove = new Trove();
    private timer: Timer;

    constructor(instance: Instance, tagClass: string) {
        super(instance, tagClass);
        this.instance.Archivable = true;

        this.timer = new Timer(.01);
        this.trove.add(this.timer);
        this.timer.completed.Connect(() => this.Update());
        this.timer.start();
    }

    Update() {
        this.timer.start();

        const clone = this.instance.Clone();
       // this.trove.add(clone);
        RemoveAllTags(clone);

        clone.GetDescendants().forEach((instance: Instance) => {
            if (instance.IsA("BasePart") || instance.IsA("Decal"))
            {
                TweenService.Create(instance, tweenInfo, { Transparency: 1 }).Play();
            }

         //   if (instance.IsA("SpecialMesh"))
           //     instance.TextureId = "";

            if (!instance.IsA("BasePart")) return;

            RemoveAllTags(instance);
            instance.CollisionGroup = "None";
            instance.Anchored = true;
           // instance.Color = new Color3(.75, .75, .75);
        });

        clone.Parent = Workspace;
        Debris.AddItem(clone, tweenInfo.Time);
    }

    Destroy() {
        this.trove.clean();
    }
}
