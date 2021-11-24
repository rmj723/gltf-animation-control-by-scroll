const scrollMax = 15000
const scrollSpeed = 0.9;
const touchScrollSpeed = 1;

export default class Scroll {

    private scrollY: number;
    private touchY: number;
    private evt: any;
    private currentValue: number;

    constructor(canvas: HTMLCanvasElement) {

        canvas.addEventListener('wheel', this.onMouseScroll.bind(this), false);
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));

        this.scrollY = 0;
        this.currentValue = 0;
        this.evt = { y: 0, deltaY: 0 };

    }

    public getPercentage(): number {
        this.currentValue = this.lerp(this.currentValue, this.scrollY, .08);
        return (this.currentValue / scrollMax)
    }

    private lerp(a: number, b: number, t: number) {
        return ((1 - t) * a + t * b);
    }

    private onMouseScroll(event: WheelEvent) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();

        this.evt.deltaY = event.deltaY * -1;
        this.evt.deltaY *= scrollSpeed;
        this.scroll();
    }

    private scroll() {
        if ((this.evt.y + this.evt.deltaY) > 0) {
            this.evt.y = 0;
        } else if ((-(this.evt.y + this.evt.deltaY)) >= scrollMax) { // limit scroll bottom
            this.evt.y = -scrollMax;
        } else {
            this.evt.y += this.evt.deltaY;
        }
        this.scrollY = -this.evt.y
    }


    private onTouchStart(event: TouchEvent) {
        this.touchY = event.targetTouches[0].pageY;
    }

    private onTouchMove(event: TouchEvent) {
        const t = event.targetTouches[0];
        this.evt.deltaY = (t.pageY - this.touchY) * touchScrollSpeed;
        this.touchY = t.pageY;
        this.scroll()
    }

}