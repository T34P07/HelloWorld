import Net from "@rbxts/net";

const Remotes = Net.Definitions.Create({
   CharacterAbilityDash: Net.Definitions.ClientToServerEvent<[]>(),
   WeaponsDamageDeal: Net.Definitions.ClientToServerEvent<[humanoidsHit: Humanoid[]]>(),
});

export default Remotes;
