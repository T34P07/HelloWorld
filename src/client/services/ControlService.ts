import { ContextActionService, RunService, UserInputService } from "@rbxts/services";
import InputService from "client/services/InputService";
import { CharacterServiceType } from "client/types/service_types/CharacterServiceType";

let lastGrounded = 0;

const ControlService = {
	characterService: undefined as CharacterServiceType | undefined,
	worldMoveDirection: Vector3.zero,
	moveDirection: Vector3.zero,
	AddController: (character: Model) => {},
	Update: (dt: number) => {
		if (!ControlService.characterService || !ControlService.characterService.hrp || !ControlService.characterService.hum) return;
		const hrpCF = ControlService.characterService.hrp.CFrame;
		const isGrounded = ControlService.characterService.hum.FloorMaterial !== Enum.Material.Air;

		ControlService.moveDirection = new Vector3(
			(InputService.IsInputActive("MoveRight") ? 1 : 0) - (InputService.IsInputActive("MoveLeft") ? 1 : 0),
			0,
			(InputService.IsInputActive("MoveForward") ? 1 : 0) - (InputService.IsInputActive("MoveBackward") ? 1 : 0),
		);

		let worldMoveDirection = hrpCF.RightVector.mul(ControlService.moveDirection.X).add(
			hrpCF.LookVector.mul(ControlService.moveDirection.Z),
		);

		if (isGrounded && !lastGrounded) {
			lastGrounded = os.clock();
		} else if (!isGrounded) {
			lastGrounded = 0;
		}

		if (!isGrounded && worldMoveDirection === Vector3.zero) worldMoveDirection = ControlService.worldMoveDirection;

		ControlService.characterService.hum.Move(ControlService.worldMoveDirection.Lerp(worldMoveDirection, 10 * dt));
		ControlService.worldMoveDirection = worldMoveDirection;

		if (isGrounded && InputService.IsInputActive("Jump")) {
			ControlService.characterService.hum.Jump = true;
		}
	},
	Start: (characterService: CharacterServiceType) => {
		ControlService.characterService = characterService;
		RunService.Heartbeat.Connect(ControlService.Update);
	},
};

export default ControlService;
