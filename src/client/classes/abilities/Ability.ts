export class Ability
{
    private cooldown = {start: 0, duration: 0};

    constructor() {}

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
