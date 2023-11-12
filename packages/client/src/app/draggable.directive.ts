// Idea from https://github.com/cedvdb/ng2draggable

import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
    topStart = 0;
    leftStart = 0;
    appAllowDrag = true;
    md: boolean = false;

    constructor(public element: ElementRef) {}

    ngOnInit(): void{
        // css changes
        if (this.appAllowDrag){
            this.element.nativeElement.style.position = 'relative';
            this.element.nativeElement.className += ' cursor-draggable';
        }
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        if (event.button === 2) {
            return; // prevents right click drag, remove his if you don't want it
        }
        this.md = true;
        this.topStart = event.clientY - this.element.nativeElement.style.top.replace('px', '');
        this.leftStart = event.clientX - this.element.nativeElement.style.left.replace('px', '');
    }

    @HostListener('document:mouseup')
    onMouseUp(event: MouseEvent): void {
        this.md = false;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.md && this.appAllowDrag){
            this.element.nativeElement.style.top = (event.clientY - this.topStart) + 'px';
            this.element.nativeElement.style.left = (event.clientX - this.leftStart) + 'px';
        }
    }

    @HostListener('touchstart', ['$event'])
    onTouchStart(event: TouchEvent): void {
        this.md = true;
        this.topStart = event.changedTouches[0].clientY - this.element.nativeElement.style.top.replace('px', '');
        this.leftStart = event.changedTouches[0].clientX - this.element.nativeElement.style.left.replace('px', '');
        event.stopPropagation();
    }

    @HostListener('document:touchend')
    onTouchEnd(): void {
        this.md = false;
    }

    @HostListener('document:touchmove', ['$event'])
    onTouchMove(event: TouchEvent): void {
        if (this.md && this.appAllowDrag){
            this.element.nativeElement.style.top = ( event.changedTouches[0].clientY - this.topStart ) + 'px';
            this.element.nativeElement.style.left = ( event.changedTouches[0].clientX - this.leftStart ) + 'px';
        }
        event.stopPropagation();
    }

    @Input('appDraggable')
    set allowDrag(value: boolean) {
        this.appAllowDrag = value;
        if (this.appAllowDrag) {
            this.element.nativeElement.className += ' cursor-draggable';
        } else {
            this.element.nativeElement.className = this.element.nativeElement.className
            .replace(' cursor-draggable', '');
        }
    }
}
