import { WeaponTagInterface } from "server/interfaces/WeaponTagInterface";
import Events from "server/modules/Events";
import TagService from "server/services/TagService";

const DamageController = {
    GetEquippedTool(character?: Model) {
        return character?.FindFirstChildWhichIsA("Tool");
    },
    DealDamage: (player: Player, humanoidsHit: Humanoid[]) => {
        const tool = DamageController.GetEquippedTool(player.Character);
        if (!tool) return;

        const tagInstance = TagService.GetTagInstance(tool.Name, tool) as WeaponTagInterface;
        if (!tagInstance) return;

        tagInstance.Hit(humanoidsHit);
    },
    Start: () => {
        Events.Weapons.Damage.Deal.Connect(DamageController.DealDamage);
    }
}

export default DamageController;
