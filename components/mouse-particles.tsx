"use client";

import Proton, {
  Alpha,
  Color,
  DomRenderer,
  Emitter,
  Gravity,
  Life,
  Mass,
  Radius,
  RandomDrift,
  Rate,
  Scale,
  Span,
  Velocity,
} from "proton-engine";
import TRAFManager from "raf-manager";
import { useEffect, useRef } from "react";

export interface MouseParticlesProps {
  num?: number;
  color?: string | string[];
  radius?: number;
  cull?: string;
  life?: number;
  tha?: number;
  alpha?: number;
  v?: number;
  g?: number;
}

export function MouseParticles(props: MouseParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const proton = useRef<Proton>(null);
  const emitter = useRef<Emitter>(null);

  const RAFManager = useRef<typeof TRAFManager | null>(null);

  function createProton() {
    proton.current = new Proton();
    emitter.current = new Emitter();
    emitter.current.rate = new Rate(3);
    emitter.current.damping = 0.008;

    const life = props.life ? new Life(props.life) : new Life(0.2, 0.5);
    const color = props.color || "random";
    const g = props.g;
    const v = props.v || 0.65;
    const alpha = new Span(0.25, 0.55);
    const tha = new Span(0, 360);
    let radius = new Radius(2, 5);
    if (props.radius) {
      const r = props.radius;
      radius = new Radius(r * 0.8, r);
    }

    emitter.current.addInitialize(new Mass(1));
    emitter.current.addInitialize(radius);
    emitter.current.addInitialize(life);
    emitter.current.addInitialize(new Velocity(new Span(v), tha, "polar"));

    emitter.current.addBehaviour(new Alpha(alpha));
    emitter.current.addBehaviour(new Color(color));
    emitter.current.addBehaviour(new Scale(1, 0.1));
    emitter.current.addBehaviour(new RandomDrift(10, 10, 0.2));
    if (g) {
      emitter.current.addBehaviour(new Gravity(g));
    }

    proton.current.addEmitter(emitter.current);
    const renderer = new DomRenderer(containerRef.current!);
    proton.current.addRenderer(renderer);
  }

  function renderProton() {
    proton.current?.update();
  }

  function onMouseMove(e: MouseEvent) {
    const x = e.clientX,
      y = e.clientY;

    if (emitter.current) {
      emitter.current.p.x += (x - emitter.current.p.x) * 0.7;
      emitter.current.p.y += (y - emitter.current.p.y) * 0.7;

      emitter.current.emit("once");
    }
  }

  function onCanvasInit() {
    createProton();
    RAFManager.current?.add(renderProton);
  }

  function onCanvasDestroy() {
    RAFManager.current?.remove(renderProton);
    proton.current?.destroy();
  }

  useEffect(() => {
    async function init() {
      RAFManager.current = (await import("raf-manager")).default;
      window.addEventListener("mousemove", onMouseMove);
      onCanvasInit();
    }

    init();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      onCanvasDestroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="fixed top-0 left-0 z-[9999]"></div>;
}
